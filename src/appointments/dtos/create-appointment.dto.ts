import { IsDateString, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsDateString()
  readonly date: string;

  @IsString()
  readonly user_id: string;

  @IsString()
  readonly doctor_id: string;
}
