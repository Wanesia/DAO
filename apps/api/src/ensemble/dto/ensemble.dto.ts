import { IsEnum, IsArray, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { MusicianCount, PracticeFrequency, EnsembleType, Genre } from '@shared/enums';

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

  @IsString()
  city: string;

  @IsString()
  postcode: string;

  @IsEnum(MusicianCount)
  number_of_musicians: MusicianCount;

  @IsEnum(PracticeFrequency)
  practice_frequency: PracticeFrequency;

  @IsEnum(EnsembleType)
  type: EnsembleType;

  @IsArray()
  @IsEnum(Genre, { each: true })
  genres: Genre[];

}

export class FindEnsemblesQueryDto {
  @IsString()
  @IsOptional()
  searchTerm?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @IsInt()
  @Min(1)
  @IsOptional()
  limit: number = 6;

  @IsOptional()
  genre?: Genre;

  @IsOptional()
  location?: string;
}