import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Headers,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ObjectID } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ParseMongoIdPipe } from 'src/parse-mongo-id.pipe';
import { Appointment } from './appointments.entity';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { UpdateAppointmentDto } from './dtos/update-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Get()
  listAppointments(): Promise<Appointment[]> {
    return this.appointmentsService.findAll();
  }

  @Get('/:id')
  async getAppointment(
    @Param('id', ParseMongoIdPipe) id: ObjectID,
  ): Promise<Appointment> {
    const appointment = await this.appointmentsService.findOne(id);
    if (!appointment) {
      throw new NotFoundException();
    }
    return appointment;
  }

  @Post()
  async createAppointment(
    @Body() body: CreateAppointmentDto,
  ): Promise<Appointment> {
    if (!ObjectId.isValid(body.user_id) || !ObjectId.isValid(body.doctor_id)) {
      throw new BadRequestException('Invalid ObjectId');
    }
    return this.appointmentsService.create(new Appointment(body));
  }

  @Put(':id')
  @HttpCode(204)
  async updateUser(
    @Param('id', ParseMongoIdPipe) id: ObjectID,
    @Body() body: UpdateAppointmentDto,
  ): Promise<void> {
    const user = await this.appointmentsService.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    await this.appointmentsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteAppointment(
    @Param('id', ParseMongoIdPipe) id: ObjectID,
  ): Promise<void> {
    const appointment = await this.appointmentsService.findOne(id);
    if (!appointment) {
      throw new NotFoundException();
    }
    await this.appointmentsService.delete(id);
  }

  @Post('notifyInDay')
  async notifyInDay(@Headers('Password') password: string): Promise<void> {
    if (password !== 'random-booking-service-password') {
      throw new ForbiddenException();
    }
    this.appointmentsService.notifyInDay();
  }

  @Post('notifyInTwoHours/')
  async notifyInTwoHours(@Headers('Password') password: string): Promise<void> {
    if (password !== 'random-booking-service-password') {
      throw new ForbiddenException();
    }
    this.appointmentsService.notifyInTwoHours();
  }
}
