import { Body, Controller, Post, Req, Sse, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SendAlertDto } from './dto/send-alert-dto';
import { AlertService } from './alert.service';

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
    this.alertService.sendAlert(userId, body);
    return { sent: true };
  }

  @Sse('stream-alerts')
  stream(): Observable<MessageEvent> {
    return alertSubject
      .asObservable()
      .pipe(map((data) => ({ data }) as MessageEvent));
  }
}
