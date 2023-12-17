import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { KeyValue } from 'src/common/constant';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('operatorReadyForChat')
  async operatorReadyForChat(@MessageBody() data: KeyValue): Promise<boolean> {
    try {
      const sockets = await this.server.fetchSockets();
      for (const socket of sockets) {
        if (socket.id === data.instanceId) {
          socket.join('operatorWaitingForChat');
        }
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  @SubscribeMessage('userRequestToChat')
  async userRequestToChat(@MessageBody() data: KeyValue): Promise<KeyValue> {
    try {
      const operatorInstances = await this.server
        .in('operatorWaitingForChat')
        .fetchSockets();

      if (!operatorInstances.length) {
        return {
          roomName: '',
          userName: '',
        };
      }
      const sockets = await this.server.fetchSockets();
      const roomName = `chatRoom-${data.instanceId}`;
      for (const socket of sockets) {
        if (socket.id === data.instanceId) {
          socket.join(roomName);
        }
      }

      const res = {
        roomName,
        userName: data.userName,
      };

      this.server.to('operatorWaitingForChat').emit('newUserRequest', res);

      return res;
    } catch (e) {
      return {
        roomName: '',
        userName: '',
      };
    }
  }

  @SubscribeMessage('operatorJoinChatRequest')
  async operatorJoinChatRequest(
    @MessageBody() data: KeyValue,
  ): Promise<boolean> {
    try {
      const currentNumberInRoom = await this.server
        .in(data.roomName)
        .fetchSockets();
      if (currentNumberInRoom.length >= 2) {
        return false;
      }
      const sockets = await this.server.fetchSockets();
      for (const socket of sockets) {
        if (socket.id === data.instanceId) {
          socket.join(data.roomName);
        }
      }

      this.server.to(data.roomName).emit('operatorJoinedChat', {
        roomName: data.roomName,
        operatorName: data.userName,
      });

      return true;
    } catch (e) {
      return false;
    }
  }

  @SubscribeMessage('sendNewMessage')
  async sendNewMessage(@MessageBody() data: KeyValue): Promise<boolean> {
    try {
      this.server.to(data.roomName).emit('newMessageReceived', data);
      return true;
    } catch (e) {
      return false;
    }
  }
}
