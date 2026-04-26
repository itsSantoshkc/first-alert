import { Inject, Injectable } from '@nestjs/common';

import { type RedisClientType } from 'redis';
import { REDIS_CLIENT } from '../redis.module';
import { RespondersAroundUserDto } from './dto/responders-around-user';
import { RespondentLiveLocationDto } from './dto/respondent-live-location';
@Injectable()
export class LocationService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: RedisClientType) {}

  getHello(): string {
    return 'Hello World!';
  }

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

  async populateData(): Promise<void> {
    try {
      // Police
      await this.redis.geoAdd('responders:police', [
        {
          longitude: 85.324,
          latitude: 27.7172,
          member: 'bdc426e1-7bc4-4e1a-a890-19ae992b90fc',
        },
        {
          longitude: 85.29,
          latitude: 27.715,
          member: '8d57ec5f-4ea9-4376-a0e4-384b5d8f206d',
        },
        {
          longitude: 85.3182,
          latitude: 27.6846,
          member: '04bdba06-5182-4df9-9b01-b61898c3d69f',
        },
        {
          longitude: 85.304,
          latitude: 27.7041,
          member: '30f5ac1e-71de-4cdd-81a4-5051d7ec67be',
        },
        {
          longitude: 85.345,
          latitude: 27.7285,
          member: '890ff134-e219-4991-9386-bcc424f705be',
        },
        {
          longitude: 85.333,
          latitude: 27.7,
          member: '7dd6aa0f-f63d-48db-a7f6-fc3794653c70',
        },
      ]);

      // Medic
      await this.redis.geoAdd('responders:medic', [
        {
          longitude: 85.3123,
          latitude: 27.712,
          member: '56b1a601-2620-4a40-adef-02fb05736b45',
        },
        {
          longitude: 85.3015,
          latitude: 27.7426,
          member: 'f2a6a8d0-3a22-42b0-a163-0e6fe943830d',
        },
        {
          longitude: 85.4298,
          latitude: 27.671,
          member: '0d93dd6d-bb68-49f4-aa31-71a23a95193e',
        },
        {
          longitude: 85.335,
          latitude: 27.734,
          member: 'b8f20407-5a1d-4268-ab33-099a8abea934',
        },
        {
          longitude: 85.359,
          latitude: 27.698,
          member: '4140db19-17c1-4650-92db-41227b3c9b78',
        },
      ]);

      // FireFighter
      await this.redis.geoAdd('responders:firefighter', [
        {
          longitude: 85.362,
          latitude: 27.7215,
          member: '3f45b28a-f13d-47e8-8123-421fc7f708cf',
        },
        {
          longitude: 85.3305,
          latitude: 27.7066,
          member: 'cce80ef8-e2ff-48bc-a217-6e355b40f4bd',
        },
        {
          longitude: 85.281,
          latitude: 27.6939,
          member: '344edb7a-c78e-4379-94dd-6d10a7251442',
        },
        {
          longitude: 85.343,
          latitude: 27.7366,
          member: '63447b25-1cb6-4e04-a505-5143c6545271',
        },
        {
          longitude: 85.342,
          latitude: 27.6915,
          member: 'aa418d4b-b4fc-4bdd-9440-2fa200604de4',
        },
      ]);
    } catch (err) {
      console.log(err);
    }
  }
}
