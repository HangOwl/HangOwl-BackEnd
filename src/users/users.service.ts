import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.model';
import { UsersModule } from './users.module';
import { Model } from 'mongoose' 
import { EmailService } from 'src/email.service';

const bcrypt = require('bcrypt')
@Injectable()
export class UsersService {
  private readonly users: User[];
  constructor(
    @InjectModel('User') private readonly userModel: Model<User> ,
    private readonly emailService: EmailService
    ) {}
  

  // if has database ( need to return userData , password ,salt )
  async findOne(email: string): Promise<User> {
    let user;
    try{
      user = await this.userModel.findOne({'Email':email.toLowerCase()});
    }catch(error){
      throw new NotFoundException('Could not find user.');
    }if (!user) {
      throw new NotFoundException('Could not find user.');
    }
    return user;
  }

  async findOneId(id: string): Promise<User> {
    let user;
    try{
      user = await this.userModel.findOne({'_id': id });
    }catch(error){
      throw new NotFoundException('Could not find user.');
    }if (!user) {
      throw new NotFoundException('Could not find user.');
    }
    return user;
  }

  async EmailVerify(token: string)
  {
    let updateduser;
    try{
      updateduser = await this.userModel.findOne({'EmailVerifyToken':token});
    }catch(error){
      throw new NotFoundException('Could not find user.');
    }if (!updateduser) {
      throw new NotFoundException('Could not find user.');
    }
    updateduser.EmailVerify = true
    updateduser.EmailVerifyToken = ""
    const result = await updateduser.save()
    return 'Success'
  }

  async ChangePasswordReq( email : string )
  {
    var token = ''
    for (var i = 0; i < 8; i++) {
        token += Math.random().toString(36).substring(5)
    }
    let updateduser;
    try{
      updateduser = await this.findOne(email)
    }catch(error){
      throw new NotFoundException('Could not find user.');
    }if (!updateduser) {
      throw new NotFoundException('Could not find user.');
    }
    updateduser.RePasswordToken = token;
    updateduser.save()

    this.emailService.send_change_password_email( email , token )
    
    return 'Success';
  }

  async ChangePassword( token: string , Password: string )
  {
    console.log(Password)
    const Salt = await bcrypt.genSalt(10) 
    Password = await bcrypt.hash(Password , Salt )
    let updateduser;
    try{
      updateduser = await this.userModel.findOne({'RePasswordToken':token});
    }catch(error){
      throw new NotFoundException('Could not find user.');
    }if (!updateduser) {
      throw new NotFoundException('Could not find user.');
    }
    updateduser.Password = Password
    updateduser.Salt = Salt
    updateduser.RePasswordToken = ""
    const result = await updateduser.save()
    return 'Success'
  }

  async ChangeEmailReq( email : string, re_email )
  {
    var token = ''
    for (var i = 0; i < 8; i++) {
        token += Math.random().toString(36).substring(5)
    }
    let updateduser;
    try{
      updateduser = await this.findOne(email)
    }catch(error){
      throw new NotFoundException('Could not find user.');
    }if (!updateduser) {
      throw new NotFoundException('Could not find user.');
    }
    updateduser.ReEmailToken = token;
    updateduser.ReEmail = re_email;
    updateduser.save()
    this.emailService.send_change_useremail_email( email , token )
    
    return 'Success';
  }

}
