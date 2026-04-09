import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { LocationService } from './locaion.service';

@Module({ controllers: [LocationController], providers: [LocationService] })
export class LocationModule {}
