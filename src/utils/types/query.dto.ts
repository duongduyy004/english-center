import { BadRequestException } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, ValidateNested } from 'class-validator';

function parseJsonLike(value: unknown, fieldName: string) {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value !== 'string') return value;

  const raw = value.trim();
  if (!raw) return undefined;

  try {
    return JSON.parse(raw);
  } catch {
    const normalized = raw
      .replace(/'/g, '"')
      .replace(/([{,]\s*)([A-Za-z0-9_]+)\s*:/g, '$1"$2":');

    try {
      return JSON.parse(normalized);
    } catch (err) {
      throw new BadRequestException(
        `${fieldName} must be valid JSON. Example: ${fieldName}={"studentName":"Nguyễn Văn Long"}`,
      );
    }
  }
}

export class QueryDto<Filter = any, Sort = any> {
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number = 10;

  @IsOptional()
  @Transform(({ value }) => {
    return parseJsonLike(value, 'filters');
  })
  @ValidateNested({ each: true })
  @Type(() => Object)
  filters?: Filter | null;

  @IsOptional()
  @Transform(({ value }) => {
    return parseJsonLike(value, 'sort');
  })
  @ValidateNested({ each: true })
  @Type(() => Object)
  sort?: Sort[] | null;
}
