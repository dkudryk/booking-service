import { Appointment } from 'src/appointments/appointments.entity';
import { DoctorSpec, UserType } from 'src/utils/const';
import { Transform } from 'class-transformer';
import { Entity, ObjectID, ObjectIdColumn, Column, Index } from 'typeorm';

@Entity('users')
export class User {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: ObjectID;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column()
  reg_token: string;

  @Column()
  photo_avatar: string;

  @Column()
  @Index({ unique: true })
  phone: string;

  @Column()
  name: string;

  @Column()
  type: UserType;

  @Column()
  spec?: DoctorSpec;

  @Column()
  appointments: Appointment[];

  constructor(user?: Partial<User>) {
    Object.assign(this, user);
  }
}
