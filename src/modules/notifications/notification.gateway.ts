import { Injectable } from '@nestjs/common'
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
    cors: {
        origin: '*'
    }
})
@Injectable()
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server

    // Map để lưu userId -> socketId
    private userSocketMap = new Map<string, string>()

    sendToUser(userId: string, payload: any) {
        this.server.to(`user:${userId}`).emit('notification', payload)
    }

    handleConnection(client: Socket, ...args: any[]) {
        const userId = client.handshake.query.userId as string

        if (userId) {
            // Lưu mapping userId -> socketId
            this.userSocketMap.set(userId, client.id)

            // Join room theo userId
            client.join(`user:${userId}`)

            console.log(`User ${userId} connected with socket ${client.id}`)
        }
    }

    handleDisconnect(client: Socket) {
        // Tìm và xóa userId khỏi map
        for (const [userId, socketId] of this.userSocketMap.entries()) {
            if (socketId === client.id) {
                this.userSocketMap.delete(userId)
                console.log(`User ${userId} disconnected`)
                break
            }
        }
    }

    // Method để check user có online không
    isUserOnline(userId: string): boolean {
        return this.userSocketMap.has(userId)
    }

    // Method để lấy danh sách user online
    getOnlineUsers(): string[] {
        return Array.from(this.userSocketMap.keys())
    }
}
