import { AlertGateway } from './alert.gateway';
import { Injectable } from '@nestjs/common';
import { SendAlertDto } from './dto/send-alert-dto';
import { PrismaService } from '../prisma.service';
import { LocationService } from '../location/locaion.service';

@Injectable()
export class AlertService {
  constructor(
    private prisma: PrismaService,
    private locationService: LocationService,
    private alertGateway: AlertGateway,
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

    setTimeout(() => {
      this.alertGateway.server.to('getAlerts').emit('Hello');
      this.alertGateway.sendAlertToUser(
        '175fc326-170d-49c1-a58d-14643576de29',
        'Hello',
      );
      console.log('Message sent tot the socket');
    }, 1000);
  }

  async sendAlertToRespondent(alertId, data: SendAlertDto) {}
}
