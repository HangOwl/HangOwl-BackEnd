import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
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
    
  }

  async login(user : any){
      const payload = {Email : user.Email , id : user.id , Role: user.Role};
      return {
          access_token: this.JwtService.sign(payload) ,
      }
  }
}