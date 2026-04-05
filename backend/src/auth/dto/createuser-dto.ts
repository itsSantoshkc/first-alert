import {
  IsAlphanumeric,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '../../generated/prisma/enums';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstname!: string;

  @IsString()
  @IsNotEmpty()
  lastname!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsAlphanumeric()
  @MinLength(8)
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsPhoneNumber()
  phone!: string;

  @IsString()
  location!: string;
}
