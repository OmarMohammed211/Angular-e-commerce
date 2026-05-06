import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service'; // Import UsersService
import * as bcrypt from 'bcryptjs';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(name: string, email: string, password: string) {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Delegate user creation to UsersService
    const user = await this.usersService.create(name, email, hashedPassword);

    // Generate token
    const payload = {
      sub: (user as unknown as { _id: Types.ObjectId })._id,
      email: user.email,
    };
    const userObj = user as unknown as {
      password?: string;
      [key: string]: unknown;
    };
    delete userObj.password;
    const userWithoutPassword = userObj;
    return {
      user: userWithoutPassword,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signIn(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Return JWT Token here...
    const payload = {
      sub: (user as unknown as { _id: Types.ObjectId })._id,
      email: user.email,
    };

    const userObj = user as unknown as {
      password?: string;
      [key: string]: unknown;
    };
    delete userObj.password;
    const userWithoutPassword = userObj;

    return {
      message: 'Login successful',
      user: userWithoutPassword,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
