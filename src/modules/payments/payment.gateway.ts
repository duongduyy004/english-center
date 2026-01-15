import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

import { Server, Socket } from 'socket.io';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'payments',
})
export class PaymentGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(PaymentGateway.name);

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);

    client.on('subscribe', (referenceCode) => {
      if (
        typeof referenceCode !== 'string' ||
        referenceCode.trim().length === 0
      )
        return;
      const room = referenceCode.trim();
      this.logger.log(`Client ${client.id} subscribed to ${room}`);
      client.join(room);
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  notifyPaymentSuccess(
    referenceCode: string,
    data: Record<string, unknown> = {},
  ) {
    if (typeof referenceCode !== 'string' || referenceCode.trim().length === 0)
      return;
    const room = referenceCode.trim();

    const status = (data?.status as string) ?? 'paid';
    const message =
      status === 'paid' ? 'Payment completed successfully' : 'Payment received';

    this.server.to(room).emit('paymentSuccess', {
      message,
      referenceCode: room,
      status,
      ...data,
    });
  }

  notifyPaymentFailure(
    referenceCode: string,
    data: Record<string, unknown> = {},
  ) {
    if (typeof referenceCode !== 'string' || referenceCode.trim().length === 0)
      return;
    const room = referenceCode.trim();

    this.server.to(room).emit('paymentFailure', {
      message: 'Payment failed',
      referenceCode: room,
      status: 'failed',
      ...data,
    });
  }
}
