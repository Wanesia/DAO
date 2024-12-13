import { IsOptional, IsBoolean, IsString, MinLength } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  newPassword?: string;

  @IsOptional()
  @IsBoolean()
  isSubscribedToNewsletter?: boolean;
}
