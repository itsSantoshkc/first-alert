import {
  IsEnum,
  IsDefined,
  IsNumber,
  ValidateNested,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Role } from '../../generated/prisma/enums';

export class AlertUserDto {
  @IsString()
  @IsDefined()
  firstName!: string;

  @IsString()
  @IsDefined()
  lastName!: string;

  @IsString()
  @IsDefined()
  phone!: string;
}

class LocationDto {
  @IsNumber()
  @IsDefined()
  longitude!: number;

  @IsNumber()
  @IsDefined()
  latitude!: number;
}

export class AcceptAlertDto {
  @ValidateNested()
  @Type(() => AlertUserDto)
  @IsDefined()
  user!: AlertUserDto;

  @IsEnum(Role)
  @IsDefined()
  alertType!: Role;

  @ValidateNested()
  @Type(() => LocationDto)
  @IsDefined()
  location!: LocationDto;

  @IsString()
  @IsDefined()
  socketId!: string;
}
