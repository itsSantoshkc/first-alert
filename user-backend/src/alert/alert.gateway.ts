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
import { SendAlertDto } from './dto/send-alert-dto';
import { REDIS_CLIENT } from '../redis.module';
import type { RedisClientType } from 'redis';
import { Inject } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
export class AlertGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(
    private jwtService: JwtService,
    @Inject(REDIS_CLIENT) private readonly redis: RedisClientType,
  ) {}

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

  @SubscribeMessage('join:activeAlert')
  handleJoinActiveAlert(
    @MessageBody() data: { alertId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`activeAlert:${data.alertId}`);
    console.log(`Joined room activeAlert:${data.alertId}`);
  }

  @SubscribeMessage('location:update')
  async handleLocationUpdate(
    @MessageBody()
    data: {
      userId: string;
      position: [number, number];
    },
  ) {
    const socketId = await this.redis.hGet('respondent:sockets', data.userId);

    if (!socketId) return;
    console.log(data);
    this.server.to(`activeAlert:${socketId}`).emit('location:update', {
      latitude: data.position[0],
      longitude: data.position[1],
    });
  }
}
