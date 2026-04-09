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
  MinLength,
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
