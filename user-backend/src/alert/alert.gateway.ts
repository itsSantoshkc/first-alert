import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AlertUserDto, SendAlertDto } from './dto/send-alert-dto';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
export class AlertGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.split(' ')[1];

      const userId = '175fc326-170d-49c1-a58d-14643576de29';

      client.join(`${userId}`);
      console.log('All rooms:', client.rooms);
    } catch {
      client.disconnect();
    }
  }

  // Call this from any service to push alert to specific user
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
      .to(`${userId}`)
      .emit(`alert:${formattedData.alertType}`, formattedData);
  }

  @SubscribeMessage('sendAlerts')
  handleGetAlerts(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log('Alert received:', data);
    return { status: 'ok' };
  }
}
