import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { AlertUserDto, SendAlertDto } from './dto/send-alert-dto';
import { Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
export class AlertGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(private jwtService: JwtService) {}

  handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.split(' ')[1];

      if (!token) throw new Error('No token');

      const payload = this.jwtService.decode(token);
      client.data.user = payload;

      client.join(`user:${payload.sub}`);
    } catch (err) {
      console.log(err);
      client.disconnect();
    }
  }

  sendAlertToRespondentFromUser(
    userId: string,
    alertDetails: SendAlertDto,
    socketId: string,
  ) {
    const formattedData = {
      alertType: alertDetails.alertType,
      alertFrom: alertDetails.user,
      location: {
        latitude: alertDetails.latitude,
        longitude: alertDetails.longitude,
      },
      socketId: socketId,
    };
    this.server
      .to(`user:${userId}`)
      .emit(`alert:${formattedData.alertType}`, formattedData);
  }

  // respondent joins alert room after accepting
  @SubscribeMessage('join:alert')
  handleJoinAlert(
    @MessageBody() data: { alertId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`alert:${data.alertId}`);
    console.log(`Client joined alert:${data.alertId}`);
    this.server.to(`alert:${data.alertId}`).emit(`alert:${data.alertId}`, {
      status: 'joined',
    });
  }

  // broadcast to alert room
  sendToAlertRoom(alertId: string, data: any) {
    this.server.to(`alert:${alertId}`).emit(`alert:${alertId}`, data);
  }

  @SubscribeMessage('alert:accept')
  handleAccept(
    @MessageBody()
    data: {
      alertId: string;
      userId: string;
      latitude: number;
      longitude: number;
    },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`alert:${data.alertId}`);
    this.server.to(`alert:${data.alertId}`).emit(`alert:${data.alertId}`, {
      status: 'accepted',
      respondent: data.userId,
      location: { latitude: data.latitude, longitude: data.longitude },
    });
  }

  @SubscribeMessage('alert:reject')
  handleReject(@MessageBody() data: { alertId: string; userId: string }) {
    console.log(`Alert ${data.alertId} rejected by ${data.userId}`);
  }

  @SubscribeMessage('location:update')
  handleLocationUpdate(
    @MessageBody()
    data: {
      userId: string;
      latitude: number;
      longitude: number;
    },
  ) {
    console.log('Location update:', data);
  }
}
