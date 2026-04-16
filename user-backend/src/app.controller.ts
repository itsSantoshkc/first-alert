import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller('user')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(new JwtAuthGuard())
  @Get()
  getHello(): string {
    console.log('Hello');
    return this.appService.getHello();
  }
}
