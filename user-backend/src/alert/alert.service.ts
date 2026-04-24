import { AcceptAlertDto } from './dto/accept-alert-dto';
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
    const newAlert = await this.prisma.alerts.create({
      data: {
        userId: userID,
        latitude: sendAlertDto.latitude,
        longitude: sendAlertDto.longitude,
      },
    });

    // Send to all the respondent with userId
    if (data) {
      if (newAlert) {
        data.responderIDs.forEach((responderID) => {
          this.alertGateway.sendAlertToRespondentFromUser(
            responderID,
            sendAlertDto,
            newAlert.id,
          );
        });
      }
    }
    return { alertId: newAlert.id };
  }

  async acceptAlert(userID: string, acceptAlertDto: AcceptAlertDto) {
    console.log(userID, acceptAlertDto);
  }
  async sendAlertToRespondent(alertId, data: SendAlertDto) {}
}
