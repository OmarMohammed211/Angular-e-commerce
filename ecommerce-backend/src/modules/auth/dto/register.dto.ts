/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { LoginDto } from './login.dto';

export class RegisterDto extends PartialType(LoginDto) {
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}