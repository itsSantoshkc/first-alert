import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

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

      client.join(`user:${userId}`);
      console.log('All rooms:', client.rooms);
    } catch {
      client.disconnect();
    }
  }

  // Call this from any service to push alert to specific user
  sendAlertToUser(userId: string, alert: any) {
    console.log(`Emitting to user:${userId}`, alert);
    this.server.to(`user:${userId}`).emit('newAlert', alert);
  }

  @SubscribeMessage('sendAlerts')
  handleGetAlerts(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log('Alert received:', data);
    return { status: 'ok' };
  }
}
