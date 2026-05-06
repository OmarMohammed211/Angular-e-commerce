/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsString, IsOptional } from 'class-validator';
import { User } from '../schemas/user.schema';

// This creates a DTO with all User fields as optional
export class UpdateUserDto extends PartialType(User) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  address?: string;
  
  @IsString()
  @IsOptional()
  phone?: string;
  

}