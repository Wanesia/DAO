import { IsString, IsNotEmpty, IsMongoId, IsEnum, IsNumber, Min, Max, IsObject, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Types } from 'mongoose';
import { Genre, InstrumentName } from '@shared/enums';

export class LocationDto {
  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  postCode: string;
}

export class InstrumentDto {
  @IsEnum(InstrumentName)
  name: InstrumentName;

  @IsNumber()
  @Min(1)
  @Max(6)
  level: number;

  @IsEnum({ each: true })
  genres: Genre[];
}

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  readonly ensembleId?: Types.ObjectId;

  @ValidateNested()
  @Type(() => InstrumentDto)
  readonly instrument: InstrumentDto;

  @ValidateNested()
  @Type(() => LocationDto)
  readonly location: LocationDto;
}

  