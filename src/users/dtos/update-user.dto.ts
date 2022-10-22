import { IsEnum, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { UserType } from 'src/utils/const';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends CreateUserDto {
  @IsPhoneNumber()
  @IsOptional()
  readonly phone: string;

  @IsString()
  @IsOptional()
  readonly name: string;

  @IsEnum(UserType)
  @IsOptional()
  type: UserType;
}
