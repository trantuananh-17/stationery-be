import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/notifications',
  cors: {
    origin: '*',
  },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    Logger.log(`Client connected: ${client.id}`, 'NotificationGateway');
  }

  handleDisconnect(client: Socket) {
    Logger.log(`Client disconnected: ${client.id}`, 'NotificationGateway');
  }

  @SubscribeMessage('notification.join')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { receiverId: string },
  ) {
    client.join(payload.receiverId);

    Logger.log(`Client ${client.id} joined room ${payload.receiverId}`, 'NotificationGateway');

    return {
      event: 'notification.joined',
      data: {
        receiverId: payload.receiverId,
      },
    };
  }
}
