import { RespondersAroundUserDto } from './dto/responders-around-user';
import { LocationService } from './locaion.service';
import { Body, Controller, Get, Post } from '@nestjs/common';

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

  @Post('pos')
  respondersAroundUser(
    @Body() responderAroundUserDto: RespondersAroundUserDto,
  ) {
    console.log(responderAroundUserDto);
    return this.locationService.getRespondersAroundUser(responderAroundUserDto);
  }
}
