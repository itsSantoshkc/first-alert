import { Type } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

class UserLocationDto {
  @IsLongitude()
  longitude!: number;

  @IsLatitude()
  latitude!: number;
}

export class RespondersAroundUserDto {
  @IsString()
  @IsNotEmpty()
  responderType!: string;

  @ValidateNested()
  @Type(() => UserLocationDto)
  userLocation!: UserLocationDto;
}
