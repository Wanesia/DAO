import { Transform, Type } from 'class-transformer';
import { IsEnum, IsArray, ValidateNested, IsOptional, IsString } from 'class-validator';
import { MusicianCount, PracticeFrequency, EnsembleType, Genre } from '@shared/enums';

class LocationDto {
  @IsString()
  city: string;

  @IsString()
  postCode: string;
}

export class CreateEnsembleDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  homepageUrl?: string | '';

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsEnum(MusicianCount)
  number_of_musicians: MusicianCount;

  @IsEnum(PracticeFrequency)
  practice_frequency: PracticeFrequency;

  @IsEnum(EnsembleType)
  type: EnsembleType;

  @IsArray()
  @IsEnum(Genre, { each: true })
  genres: Genre[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  member_ids?: string[];
}
