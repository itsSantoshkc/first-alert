import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Headers,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createuser-dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user-dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from '@prisma/client/runtime/client';
import { type Request, type Response } from 'express';

const isProd = process.env.NODE_ENV === 'production';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd, // true only in prod
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.signUp(createUserDto);
    await res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
    return { access_token: accessToken, userData: user };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async logIn(
    @Body() logInDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.logIn(logInDto);
    await res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
    return { access_token: accessToken, userData: user };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies?.refreshToken;
    console.log(req);
    const { access_token, refresh_token } =
      await this.authService.refreshToken(token);

    res.cookie('refreshToken', refresh_token, REFRESH_COOKIE_OPTIONS);

    return { access_token: access_token };
  }

  @UseGuards(new JwtAuthGuard())
  @Get('test')
  findAll() {
    return { message: 'Hello World' };
  }
}
