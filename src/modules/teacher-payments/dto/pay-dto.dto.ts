import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class PayDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsString()
  method: string;

  @IsOptional()
  @IsString()
  note?: string;
}
