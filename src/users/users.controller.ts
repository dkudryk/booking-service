import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ObjectID } from 'typeorm';
import { ParseMongoIdPipe } from 'src/parse-mongo-id.pipe';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  listUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('/:id')
  async getUser(@Param('id', ParseMongoIdPipe) id: ObjectID): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Post()
  createUser(@Body() body: CreateUserDto): Promise<User> {
    return this.usersService.create(new User(body));
  }

  @Put(':id')
  @HttpCode(204)
  async updateUser(
    @Param('id', ParseMongoIdPipe) id: ObjectID,
    @Body() body: UpdateUserDto,
  ): Promise<void> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    await this.usersService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id', ParseMongoIdPipe) id: ObjectID): Promise<void> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    await this.usersService.delete(id);
  }
}
