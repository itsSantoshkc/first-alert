import { AcceptAlertDto } from './dto/accept-alert-dto';
import { AlertGateway } from './alert.gateway';
import { Inject, Injectable } from '@nestjs/common';
import { SendAlertDto } from './dto/send-alert-dto';
import { PrismaService } from '../prisma.service';
import { LocationService } from '../location/locaion.service';
import { REDIS_CLIENT } from '../redis.module';
import type { RedisClientType } from 'redis';

@Injectable()
export class AlertService {
  constructor(
    private prisma: PrismaService,
    private locationService: LocationService,
    private alertGateway: AlertGateway,
    @Inject(REDIS_CLIENT) private readonly redis: RedisClientType,
  ) {}
  async sendAlert(userID: string, sendAlertDto: SendAlertDto) {
    if (!userID) {
      throw new Error('User ID empty');
    }

    if (!sendAlertDto) {
      throw new Error('Body is empty');
    }

    const data = await this.locationService.getRespondersAroundUser({
      responderType: sendAlertDto.alertType,
      userLocation: {
        longitude: sendAlertDto.longitude,
        latitude: sendAlertDto.latitude,
      },
    });
    const newAlert = await this.prisma.alerts.create({
      data: {
        userId: userID,
        latitude: sendAlertDto.latitude,
        longitude: sendAlertDto.longitude,
      },
    });

    if (data) {
      if (newAlert) {
        data.responderIDs.forEach((responderID) => {
          this.alertGateway.sendAlertToRespondentFromUser(
            responderID,
            sendAlertDto,
            newAlert.id,
          );
        });
        await this.redis.hSet('respondent:sockets', userID, newAlert.id);
      }
    }
    return { alertId: newAlert.id };
  }

  async acceptAlert(userID: string, acceptAlertDto: AcceptAlertDto) {
    const updateAlertData = await this.prisma.alerts.update({
      data: {
        respondentId: userID,
      },
      where: {
        id: acceptAlertDto.socketId,
      },
    });

    await this.redis.hSet(
      'respondent:sockets',
      userID,
      acceptAlertDto.socketId,
    );

    this.alertGateway.server
      .to(`activeAlert:${acceptAlertDto.socketId}`)
      .emit('location:update', {
        longitude: acceptAlertDto.longitude,
        latitude: acceptAlertDto.latitude,
      });

    return {
      alertId: updateAlertData.id,
    };
  }
  async sendAlertToRespondent(alertId, data: SendAlertDto) {}
}
