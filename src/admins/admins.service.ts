import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/users.model';
import { Model } from 'mongoose'
import { Admin } from './admins.model';

const bcrypt = require('bcrypt')
@Injectable()
export class AdminsService {
  private readonly admins: Admin[];
  constructor(    
              @InjectModel('User') private readonly adminModel: Model<Admin>,
              @InjectModel('User') private readonly userModel: Model<User>
              ) {}

  async add_admin(admin): Promise<string>
  {
      //admin contain email password username
      const user = await this.userModel.findOne({'Email':admin.Email});
      if(user)
        return "Email already exist.";
      //payload in admin is  'Email','Password' ,'UserName','LineID','OpenTime','CloseTime','CloseWeekDay','Address' , 'AdminDescription', 'AdminRule'
      // Doesn't have Role , ProfilePicPath , AdditionalPicture 
      // Set default
      admin.Role = 2
      admin.salt = await bcrypt.genSalt(10)
      admin.Password = await bcrypt.hash(admin.Password , admin.salt )
      //adding admin procedure

      const newAdmin = new this.adminModel({
        Email: admin.Email,
        Password: admin.Password,
        Salt: admin.salt,
        Role: admin.Role,
        Name: admin.AdminName,
      });
      const result = await newAdmin.save();
      //email procedure
      return result.id as string;
  }
}
