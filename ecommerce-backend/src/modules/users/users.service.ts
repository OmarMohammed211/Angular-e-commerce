import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Create is usually called by AuthService during signup
  async create(
    name: string,
    email: string,
    hashedPassword: string,
  ): Promise<User> {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
    });
    return newUser.save();
  }

  // Used by AuthService to find user during login
  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email }).lean().exec();
  }

  // Get User Profile
  async findById(id: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID');

    const user = await this.userModel
      .findById(id)
      .select('-password')
      .lean()
      .exec(); // Exclude password
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // Update User Profile
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password')
      .exec();

    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  // Delete User
  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('User not found');
  }
}
