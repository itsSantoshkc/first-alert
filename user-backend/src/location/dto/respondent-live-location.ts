import { Type } from 'class-transformer';
import {
  IsAlphanumeric,
  IsEmail,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class RespondentLocationDto {
  @IsLongitude()
  longitude!: number;

  @IsLatitude()
  latitude!: number;
}

export class RespondentLiveLocationDto {
  @IsString()
  @IsNotEmpty()
  responderType!: string; //Todo: Turn this into enum instead of a string

  @ValidateNested()
  @Type(() => RespondentLocationDto)
  userLocation!: RespondentLocationDto;
}
