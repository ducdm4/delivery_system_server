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

const SHIPPER_WAITING_CALL_ROOM = 'shipperWaitingCall';

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

  @SubscribeMessage('userReJoinChat')
  async userReJoinChat(@MessageBody() data: KeyValue): Promise<boolean> {
    const sockets = await this.server.fetchSockets();
    for (const socket of sockets) {
      if (socket.id === data.instanceId) {
        this.server.to(data.roomName).emit('newClientInstanceJoined', {
          instanceId: data.instanceId,
        });
        socket.join(data.roomName);
      }
    }

    return true;
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

  @SubscribeMessage('customerExitChat')
  async customerExitChat(@MessageBody() data: KeyValue): Promise<boolean> {
    try {
      const sockets = await this.server.fetchSockets();
      for (const socket of sockets) {
        if (socket.id === data.instanceId) {
          socket.leave(data.roomName);
        }
      }

      this.server.to(data.roomName).emit('clientLeaveRoom', {
        roomName: data.roomName,
      });

      return true;
    } catch (e) {
      return false;
    }
  }

  @SubscribeMessage('shipperWaitingCall')
  async shipperWaitingCall(@MessageBody() data: KeyValue): Promise<boolean> {
    try {
      const sockets = await this.server.fetchSockets();
      for (const socket of sockets) {
        if (socket.id === data.instanceId) {
          socket.join(SHIPPER_WAITING_CALL_ROOM);
        }
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  @SubscribeMessage('customerRequestCallShipper')
  async customerRequestCallShipper(
    @MessageBody() data: KeyValue,
  ): Promise<boolean> {
    try {
      const roomName = `call_${data.trackingId}`;
      const sockets = await this.server.fetchSockets();
      for (const socket of sockets) {
        if (socket.id === data.instanceId) {
          socket.join(roomName);
        }
      }
      const currentSocketInRoom = await this.server
        .in(SHIPPER_WAITING_CALL_ROOM)
        .fetchSockets();
      if (currentSocketInRoom.length === 0) return false;
      console.log('count shipper waiting', currentSocketInRoom.length);
      console.log('data', data);
      this.server.to(SHIPPER_WAITING_CALL_ROOM).emit('customerRequestCall', {
        instanceId: data.instanceId,
        trackingId: data.trackingId,
        roomName,
      });

      return true;
    } catch (e) {
      return false;
    }
  }

  @SubscribeMessage('shipperWantJoinCall')
  async shipperWantJoinCall(@MessageBody() data: KeyValue): Promise<boolean> {
    try {
      console.log('shipperWantJoinCall');
      const currentSocketInRoom = await this.server
        .in(data.roomName)
        .fetchSockets();
      if (currentSocketInRoom.length >= 2) {
        return false;
      }

      console.log('currentSocketInRoom.length', currentSocketInRoom.length);
      for (const socket of currentSocketInRoom) {
        if (socket.id !== data.instanceId) {
          // socket.emit();
          socket.emit('shipperCanJoinCall', {
            peerId: data.peerId,
          });
        }
      }
      return true;
    } catch (e) {
      return false;
    }
  }
}
