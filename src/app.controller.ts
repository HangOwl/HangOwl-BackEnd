import { Controller, Request, Get , Post, UseGuards , Headers , Param , HttpStatus , Res , Patch } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { JWTUtil } from 'src/auth/JWTUtil';
import { EmailService } from './email.service';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService ,
              private authService: AuthService ,
              private readonly jwtUtil: JWTUtil, 
              private emailService: EmailService,
              private userService: UsersService ) {} 
              

  @Get()
  getHello(): any {
    return "Hello World"
  }

  @Get('pictures/:imagename')
  getImage(@Param('imagename') image, @Res() res) {
    const response = res.sendFile(image, { root: 'uploads' });
    return {
      status: HttpStatus.OK,
      data: response,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    const response =  await this.authService.login(req.user);
    if(response.EmailVerify == false) return "Verify your email first"  
    response.access_token = 'bearer'.concat(' ' , response.access_token)
    return { 'Authorization' : response.access_token , 'id' : response.id , 'Role' :response.Role }
  }

  @Get('auth/verify/:token')
  async user_verify(@Param('token') token) {
    return await this.userService.EmailVerify(token)
  }
  @Post('auth/change_password')
  async change_password_req(@Request() req)
  {
    if(req.body.Email == null) return 'Email cannot be null'
    return await this.userService.ChangePasswordReq(req.body.Email)
  }
  @Patch('auth/change_password')
  async change_password(@Request() req)
  {
    if(req.body.Password == null) return 'Password cannot be null'
    if(req.body.token == null) return 'Token cannot be null'
    return await this.userService.ChangePassword(req.body.token , req.body.Password)
  }
  @Get('comfirm')
  async email_test() {
    return await this.emailService.send_email( )
  }
}





