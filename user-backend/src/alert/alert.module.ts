import { Module } from '@nestjs/common';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';
import { AlertGateway } from './alert.gateway';
import { LocationService } from '../location/locaion.service';

@Module({
  controllers: [AlertController],
  providers: [AlertService, AlertGateway, LocationService],
})
export class AlertModule {}
