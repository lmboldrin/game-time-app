import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userSchema: Model<UserDocument>) { }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userSchema.find(
      {
        $or: [
          { email: createUserDto.email },
          { username: createUserDto.username }
        ]
      }
    );

    if (existingUser.length > 0)
      throw new BadRequestException('The email or username is already in use.');

    const passwordHash = bcrypt.hashSync(createUserDto.password);
    createUserDto.password = passwordHash.ToString();

    return await this.userSchema.create(createUserDto);
  }

  async findOne(id: string) {
    const user = await this.userSchema.findById(id);
    if (!user) throw new NotFoundException('User not found.');
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userSchema.find({ email: email });
    if (!user) throw new NotFoundException('User not found.');
    return user;
  }

  async findOneByUsername(username: string) {
    const user = await this.userSchema.find({ email: username });
    if (!user) throw new NotFoundException('User not found.');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userSchema.findById(id);
    if (!user) throw new NotFoundException('User not found.');
    return await this.userSchema.findByIdAndUpdate(id, updateUserDto)
  }

  async updatePassword(id: string, oldPassword: string, newPassword: string) {
    const user = await this.userSchema.findById(id);

    if (!user) throw new NotFoundException('User not found.');

    if (!bcrypt.compareSync(oldPassword, user.password))
      throw new BadRequestException('The old password is incorrect.');

    const passwordHash = bcrypt.hashSync(newPassword);

    return await this.userSchema.findByIdAndUpdate(id, { password: passwordHash });
  }

  async remove(id: string) {
    const user = await this.userSchema.findById(id);
    if (!user) throw new NotFoundException('User not found.');
    return await this.userSchema.findByIdAndDelete(id);
  }
}
