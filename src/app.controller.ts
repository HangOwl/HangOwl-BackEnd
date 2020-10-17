import { Controller, Request, Get , Post, UseGuards , Headers , Param , HttpStatus , Res } from '@nestjs/common';
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
    response.access_token = 'bearer'.concat(' ' , response.access_token)
    return response
  }
}





