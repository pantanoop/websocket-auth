/* eslint-disable */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Session } from '../session/entities/session.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async createUser(email: string, password: string) {
    const user = this.userRepository.create({
      email,
      password,
    });
    return await this.userRepository.save(user);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email, password },
    });

    console.log(user, 'service');
    if (!user) {
      return null;
    }
    const loginAttempts = await this.sessionRepository.count({
      where: { userid: user.id },
    });
    console.log(loginAttempts, 'service');
    if (loginAttempts >= 2) {
      console.log('in error');
      throw new HttpException(
        { message: 'account already Logged in 2 devices' },
        409,
      );
    }

    await this.userRepository.save(user);
    return { email: email, password: password, id: user.id };
  }
}
