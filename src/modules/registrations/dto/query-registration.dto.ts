import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Registration } from '../registration.domain';

export class FilterRegistrationDto {
  @IsOptional()
  @IsString()
  email?: string;
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsBoolean()
  processed?: boolean;
  @IsOptional()
  @IsString()
  class?: string; // Assuming class is a string identifier, adjust as necessary
}

export class SortRegistrationDto {
  @IsString()
  orderBy: keyof Registration;
  @IsEnum(['ASC', 'DESC'])
  order: 'ASC' | 'DESC';
}
