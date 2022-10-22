import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, MongoRepository, ObjectID, UpdateResult } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: MongoRepository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: ObjectID): Promise<User> {
    return this.usersRepository.findOneBy(id);
  }

  create(data: User): Promise<User> {
    return this.usersRepository.save(data);
  }

  update(id: ObjectID, data: Partial<User>): Promise<UpdateResult> {
    return this.usersRepository.update(id, data);
  }

  delete(id: ObjectID): Promise<DeleteResult> {
    return this.usersRepository.delete(id);
  }
}
