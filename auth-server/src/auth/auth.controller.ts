/* eslint-disable */
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { SessionGuard } from '../guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(SessionGuard)
  validateCookie() {
    return `hellllio`;
  }

  @Post('signup')
  async signup(
    @Body('email') email: string,
    @Body('password') password: string,
    @Request() req,
    @Res({ passthrough: true }) response,
  ) {
    const user = await this.authService.createUser(email, password);

    req.session.user = {
      email: user.email,
    };

    response.cookie('email', user.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000000,
      sameSite: 'strict',
    });

    return {
      message: 'Signup successful',
      user: { email: user.email, id: user.id },
    };
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() req, @Res({ passthrough: true }) response) {
    req.session.user = req.user;

    response.cookie('email', req.user.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 10000000,
      sameSite: 'strict',
    });

    return {
      message: 'Login successful',
      user: { email: req.user.email, id: req.user.id },
    };
  }

  @Post('logout')
  logout(@Request() req, @Res({ passthrough: true }) response) {
    req.session.destroy();

    response.clearCookie('email');

    return { message: 'Logged out successfully' };
  }
}
