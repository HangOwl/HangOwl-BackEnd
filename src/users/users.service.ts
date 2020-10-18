import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.model';
import { UsersModule } from './users.module';
import { Model } from 'mongoose' 
@Injectable()
export class UsersService {
  private readonly users: User[];
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>
    ) {}
  

  // if has database ( need to return userData , password ,salt )
  async findOne(email: string): Promise<User> {
    let user;
    try{
      user = await this.userModel.findOne({'Email':email});
    }catch(error){
      throw new NotFoundException('Could not find user.');
    }if (!user) {
      throw new NotFoundException('Could not find user.');
    }
    return user;
  }
}
