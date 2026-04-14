import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma.module';
import { LocationModule } from './location/location.module';
import { RedisModule } from './redis.module';
import { AlertModule } from './alert/alert.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    PrismaModule,
    LocationModule,
    RedisModule,
    AlertModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
