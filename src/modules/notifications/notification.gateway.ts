import { Injectable } from '@nestjs/common'
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets'
import { Server } from 'socket.io'

@WebSocketGateway({
    cors: {
        origin: '*'
    }
})
@Injectable()
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server

    sendToUser(userId: string, payload: any) {
        this.server.to(`user:${userId}`).emit('notification', payload)
    }

    handleConnection(client: any, ...args: any[]) {

    }

    handleDisconnect(client: any) {

    }
}
