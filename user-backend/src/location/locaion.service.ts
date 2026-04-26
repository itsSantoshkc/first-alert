import { Inject, Injectable } from '@nestjs/common';

import { type RedisClientType } from 'redis';
import { REDIS_CLIENT } from '../redis.module';
import { RespondersAroundUserDto } from './dto/responders-around-user';
import { RespondentLiveLocationDto } from './dto/respondent-live-location';
@Injectable()
export class LocationService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: RedisClientType) {}

  async updateRespondentsLiveLocation(
    respondentLiveLocationDto: RespondentLiveLocationDto,
    respondentId: string,
  ) {
    try {
      const { latitude, longitude, responderType } = respondentLiveLocationDto;

      if (!latitude || !longitude || !responderType) {
        console.error('Missing fields:', {
          latitude,
          longitude,
          responderType,
        });
        return { updated: false };
      }

      const redisResponderKey = `responders:${responderType.toLowerCase()}`;

      const res = await this.redis.geoAdd(redisResponderKey, {
        longitude: Number(longitude),
        latitude: Number(latitude),
        member: String(respondentId),
      });
      return { updated: res > 0 };
    } catch (error) {
      console.error(error);
      return { updated: false };
    }
  }

  async getRespondersAroundUser(
    responderAroundUserDto: RespondersAroundUserDto,
  ) {
    const redisResponderKey = `responders:${responderAroundUserDto.responderType.toLowerCase()}`;
    const maxRadius = 50;
    let radius = 20;

    while (radius <= maxRadius) {
      const res = await this.redis.geoSearch(
        redisResponderKey,
        {
          longitude: responderAroundUserDto.userLocation.longitude,
          latitude: responderAroundUserDto.userLocation.latitude,
        },
        {
          radius,
          unit: 'km',
        },
      );

      if (res.length > 0) {
        return {
          responderIDs: ['175fc326-170d-49c1-a58d-14643576de29', ...res],
        };
      }

      radius += 10;
    }

    return {
      responderIDs: [],
    };
  }
}
