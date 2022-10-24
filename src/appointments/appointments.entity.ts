import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@Entity('appointments')
export class Appointment {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  date: string;

  @Column()
  user_id: string;

  @Column()
  doctor_id: string;

  @Column()
  active: boolean;

  constructor(appointment?: Partial<Appointment>) {
    Object.assign(this, appointment);
  }
}
