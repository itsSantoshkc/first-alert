import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SendAlertDto } from './dto/send-alert-dto';
import { AlertService } from './alert.service';
import { AcceptAlertDto } from './dto/accept-alert-dto';

const alertSubject = new Subject<any>();

@Controller('alert')
export class AlertController {
  constructor(private alertService: AlertService) {}
  @UseGuards(AuthGuard('jwt'))
  @Post('send-alert')
  sendAlert(
    @Req() req: Request & { user?: { userId?: string } },
    @Body() body: SendAlertDto,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User ID is empty');
    }
    return this.alertService.sendAlert(userId, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('accept-alert')
  acceptAlert(
    @Req() req: Request & { user?: { userId?: string } },
    @Body() body: AcceptAlertDto,
  ) {
    const responderID = req.user?.userId;
    if (!responderID) {
      throw new Error('User ID is empty');
    }

    if (!body) {
      throw new Error('Body is empty');
    }
    return this.alertService.acceptAlert(responderID, body);
  }
}
