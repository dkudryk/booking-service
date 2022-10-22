import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform<any, ObjectId> {
  transform(value: string) {
    try {
      return ObjectId.createFromHexString(value);
    } catch (e: any) {
      throw new BadRequestException('Invalid ObjectId');
    }
  }
}
