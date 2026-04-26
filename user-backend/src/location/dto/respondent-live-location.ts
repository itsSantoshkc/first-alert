import { IsLatitude, IsLongitude, IsNotEmpty, IsString } from 'class-validator';

export class RespondentLiveLocationDto {
  @IsString()
  @IsNotEmpty()
  responderType!: string;

  @IsLongitude()
  longitude!: number;

  @IsLatitude()
  latitude!: number;
}
