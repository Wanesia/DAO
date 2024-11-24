import { IsEnum, IsNumber, Min, Max, IsArray, ArrayNotEmpty } from 'class-validator';
import { InstrumentName, Genre } from '@shared/enums';

export class AddInstrumentDto {
  @IsEnum(InstrumentName)
  name: InstrumentName;

  @IsNumber()
  @Min(1)
  @Max(6)
  level: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Genre, { each: true })
  genres: Genre[];
}
