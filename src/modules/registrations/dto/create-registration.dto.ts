import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateRegistrationDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  @IsEnum(['male', 'female'])
  gender: string;

  @IsString()
  address: string;

  @IsString()
  note: string;

  @IsBoolean()
  processed: boolean;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  classId: string;
}
