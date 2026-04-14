import { Body, Controller, Post, Sse } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

const alertSubject = new Subject<any>();

@Controller('alert')
export class AlertController {
  @Post('send-alert')
  sendAlert(@Body() body: { message: string }) {
    alertSubject.next(body);
    return { sent: true };
  }

  @Sse('stream-alerts')
  stream(): Observable<MessageEvent> {
    return alertSubject
      .asObservable()
      .pipe(map((data) => ({ data }) as MessageEvent));
  }
}
