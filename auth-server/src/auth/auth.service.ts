/* eslint-disable */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(email: string, password: string) {
    const user = this.userRepository.create({
      email,
      password,
      loginAttempts: 1,
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
    if (user.loginAttempts === 3) {
      throw new HttpException('Already logged in 2 devices', 409);
    }
    user.loginAttempts += 1;
    await this.userRepository.save(user);
    return { email: email, password: password };
  }
}
