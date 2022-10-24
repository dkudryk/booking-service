import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/appointments/appointments.entity';
import { UserType } from 'src/utils/const';
import { DeleteResult, MongoRepository, ObjectID, UpdateResult } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: MongoRepository<User>,
    @InjectRepository(Appointment)
    private readonly appointmentsRepository: MongoRepository<Appointment>,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find();
    const appointments = await this.appointmentsRepository.findBy({
      date: { $gte: new Date().toISOString() },
      active: true,
    });
    return users.map((user) => {
      const userAppointments = appointments.filter(
        (appointment) =>
          (user.type === UserType.USER &&
            appointment.user_id === user.id.toString()) ||
          (user.type === UserType.DOC &&
            appointment.doctor_id === user.id.toString()),
      );
      return {
        ...user,
        appointments: userAppointments,
      };
    });
  }

  async findOne(id: ObjectID): Promise<User> {
    const user = await this.usersRepository.findOneBy(id);
    const appointments = await this.appointmentsRepository.findBy({
      date: { $gte: new Date().toISOString() },
      active: true,
      ...(user.type === UserType.USER
        ? {
            user_id: id.toString(),
          }
        : { doctor_id: id.toString() }),
    });
    return {
      ...user,
      appointments,
    };
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
