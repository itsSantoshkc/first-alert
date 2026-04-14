import { AuthGuard } from '@nestjs/passport';
import { RespondentLiveLocationDto } from './dto/respondent-live-location';
import { RespondersAroundUserDto } from './dto/responders-around-user';
import { LocationService } from './locaion.service';
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { type Request } from 'express';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  getHello(): string {
    return this.locationService.getHello();
  }

  @Post()
  populate() {
    console.log('Hello');
    return this.locationService.populateData();
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('live-location')
  updateRespondentsLiveLocation(
    @Body() respondentLiveLocationDto: RespondentLiveLocationDto,
    @Req() req: Request,
  ) {
    const respondentId = req.user!['userId'];
    console.log(respondentId);
    return this.locationService.updateRespondentsLiveLocation(
      respondentLiveLocationDto,
      respondentId,
    );
  }

  @Post('pos')
  respondersAroundUser(
    @Body() responderAroundUserDto: RespondersAroundUserDto,
  ) {
    console.log(responderAroundUserDto);
    return this.locationService.getRespondersAroundUser(responderAroundUserDto);
  }
}
