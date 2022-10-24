import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LOGS_PATH, MAX_REGISTERED_COUNT } from 'src/utils/const';
import { DeleteResult, MongoRepository, ObjectID, UpdateResult } from 'typeorm';
import { Appointment } from './appointments.entity';
import { createFile } from '../utils/helpers';
import { User } from 'src/users/users.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentsRepository: MongoRepository<Appointment>,
    @InjectRepository(User)
    private readonly usersRepository: MongoRepository<User>,
  ) {}

  findAll(): Promise<Appointment[]> {
    return this.appointmentsRepository.find();
  }

  findOne(id: ObjectID): Promise<Appointment> {
    return this.appointmentsRepository.findOneBy(id);
  }

  async create(data: Appointment): Promise<Appointment> {
    const startDate = new Date(data.date);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(data.date);
    endDate.setUTCHours(23, 59, 59, 999);

    const appointment = await this.appointmentsRepository.findOneBy({
      date: { $gte: startDate.toISOString(), $lt: endDate.toISOString() },
      user_id: data.user_id,
      doctor_id: data.doctor_id,
    });
    if (appointment) {
      throw new BadRequestException(
        'This user is already registered with this doctor on this date',
      );
    }

    const doctorAppointments = await this.appointmentsRepository.count({
      date: { $gte: startDate.toISOString(), $lt: endDate.toISOString() },
      doctor_id: data.doctor_id,
    });
    console.log(doctorAppointments);
    if (doctorAppointments >= MAX_REGISTERED_COUNT) {
      throw new BadRequestException(
        'This user cannot be registered with this doctor',
      );
    }

    return this.appointmentsRepository.save(data);
  }

  update(id: ObjectID, data: Partial<Appointment>): Promise<UpdateResult> {
    return this.appointmentsRepository.update(id, data);
  }

  delete(id: ObjectID): Promise<DeleteResult> {
    return this.appointmentsRepository.delete(id);
  }

  async notifyInDay(): Promise<void> {
    const date = new Date();
    date.setDate(date.getDate() + 1);

    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59, 999);

    const appointments = await this.appointmentsRepository.findBy({
      date: { $gte: startDate.toISOString(), $lt: endDate.toISOString() },
      active: true,
    });
    await Promise.all(
      appointments.map(async (appointment) => {
        const user = await this.usersRepository.findOneBy(appointment.user_id);
        const doctor = await this.usersRepository.findOneBy(
          appointment.doctor_id,
        );
        const str = `${new Date().toISOString()} | Привет ${
          user.name
        }! Напоминаем что вы записаны к ${doctor.spec} завтра в ${
          appointment.date
        }!\n`;
        return createFile(LOGS_PATH, 'notifications.log', str);
      }),
    );
  }

  async notifyInTwoHours(): Promise<void> {
    const startDate = new Date();
    startDate.setHours(startDate.getHours() + 2);
    const endDate = new Date();
    endDate.setHours(endDate.getHours() + 2);
    endDate.setMinutes(endDate.getMinutes() + 10);

    const appointments = await this.appointmentsRepository.findBy({
      date: { $gte: startDate.toISOString(), $lt: endDate.toISOString() },
      active: true,
    });
    await Promise.all(
      appointments.map(async (appointment) => {
        const user = await this.usersRepository.findOneBy(appointment.user_id);
        const doctor = await this.usersRepository.findOneBy(
          appointment.doctor_id,
        );
        const str = `${new Date().toISOString()} | Привет ${
          user.name
        }! Вам через 2 часа к ${doctor.spec} в ${appointment.date}!\n`;
        return createFile(LOGS_PATH, 'notifications.log', str);
      }),
    );
  }
}
