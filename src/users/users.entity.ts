import { UserType } from 'src/utils/const';
import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  email: string;

  @Column()
  reg_token: string;

  @Column()
  photo_avatar: string;

  @Column()
  phone: string;

  @Column()
  name: string;

  @Column()
  type: UserType;

  constructor(user?: Partial<User>) {
    Object.assign(this, user);
  }
}
