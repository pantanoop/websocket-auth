import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Session } from '../session/entities/session.entity';
import { User } from '../auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AuthGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  @WebSocketServer() server: Server;
  client: Socket;
  otp: string | null | undefined;

  handleConnection(client: Socket) {
    console.log('new user connected', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('user disconnected', client.id);
  }

  @SubscribeMessage('onConnection')
  async handleonConnection(
    @MessageBody() id: number,
    @ConnectedSocket() client: Socket,
  ) {
    const sessionCount = await this.sessionRepository.count({
      where: { userid: id },
    });
    if (sessionCount < 2) {
      const session = this.sessionRepository.create({
        userid: id,
        sessionId: client.id,
      });
      const s = await this.sessionRepository.save(session);
    }

    this.server.emit('message', id, 'id client', client.id);
  }

  @SubscribeMessage('onGenerateOtp')
  async handleonGenerateOtp(@ConnectedSocket() client: Socket) {
    const otpcode = Math.floor(1000 + Math.random() * 9000).toString();
    client.broadcast.emit('otp', otpcode);
    this.otp = otpcode;
  }

  @SubscribeMessage('onVerifyOtp')
  async handleonVerifyOtp(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    if (data.otp != this.otp) {
      client.emit('invalid otp');
      return;
    }
    console.log('data email', data.email);
    const existingUser = await this.userRepository.findOne({
      where: { email: data.email },
    });
    const userId = existingUser?.id;
    console.log('existing user id', userId);
    const existing = await this.sessionRepository.findOne({
      where: { userid: userId },
    });
    const delClientId: any = existing?.sessionId;
    const socket = this.server.sockets.sockets.get(delClientId);
    socket?.emit('logout');
    socket?.disconnect();
    await this.sessionRepository.delete({ sessionId: delClientId });
    const session = this.sessionRepository.create({
      userid: userId,
      sessionId: client.id,
    });
    
    await this.sessionRepository.save(session);
    const newUser = await this.userRepository.find({
      where: { id: userId },
    });
    const newSessionId = session.sessionId;
    const nsocket = this.server.sockets.sockets.get(newSessionId);
    nsocket?.emit('login', newUser);
  }
}
