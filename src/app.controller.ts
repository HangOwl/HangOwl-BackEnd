import { Controller, Request, Get , Post, UseGuards , Headers} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { JWTUtil } from 'src/auth/JWTUtil';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService ,
              private authService: AuthService ,
              private readonly jwtUtil: JWTUtil, ) {}

  @Get()
  getHello(): any {
    return "Hello World"
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    console.log(req.user)
    return this.authService.login(req.user);
  }
}





