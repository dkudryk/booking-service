import { IsBoolean } from 'class-validator';

export class UpdateAppointmentDto {
  @IsBoolean()
  readonly active: boolean;
}
