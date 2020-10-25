import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
const bcrypt = require('bcrypt')
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService ,
              private JwtService: JwtService) {}

/*
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && user.Password === password) {
      const { Password, ...result } = user;
      return result;
    }
    return null;
  }
*/

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if(!user) return null 
    const input_password = await bcrypt.hash(password , user.Salt) // Uncomment this when use database
    //const input_password = password // comment this when use database
    if ( user.Password == input_password)
    {
        const result = user.toJSON()
        return { _id : result._id , Role : result.Role , EmailVerify : result.EmailVerify }
    }
    return null
  }

  

  async login(user : any){
      const payload = user
      console.log(payload)
      return {
          access_token: this.JwtService.sign(payload) ,
          EmailVerify: payload.EmailVerify ,
          id: payload._id
      }
  }
}