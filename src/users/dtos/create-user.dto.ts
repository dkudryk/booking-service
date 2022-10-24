import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { DoctorSpec, UserType } from 'src/utils/const';

export class CreateUserDto {
  @IsEmail()
  @IsOptional()
  readonly email: string;

  @IsString()
  @IsOptional()
  readonly reg_token: string;

  @IsString()
  @IsOptional()
  readonly photo_avatar: string;

  @IsPhoneNumber()
  readonly phone: string;

  @IsString()
  readonly name: string;

  @IsEnum(UserType)
  readonly type: UserType;

  @IsEnum(DoctorSpec)
  @IsOptional()
  readonly spec: DoctorSpec;
}
