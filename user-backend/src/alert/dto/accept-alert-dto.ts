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

export class AcceptAlertDto {
  @ValidateNested()
  @Type(() => AlertUserDto)
  @IsDefined()
  user!: AlertUserDto;

  @IsEnum(Role)
  @IsDefined()
  alertType!: Role;

  @IsNumber()
  @IsDefined()
  longitude!: number;

  @IsNumber()
  @IsDefined()
  latitude!: number;

  @IsString()
  @IsDefined()
  socketId!: string;
}
