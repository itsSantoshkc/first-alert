import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Role } from '../../generated/prisma/enums';

export class SendAlertDto {
  @IsEnum(Role)
  @IsNotEmpty()
  alertType!: Role;

  @IsNumber()
  @IsNotEmpty()
  longitude!: number;

  @IsNumber()
  @IsNotEmpty()
  latitude!: number;
}
