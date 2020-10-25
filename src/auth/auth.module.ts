import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './const';
import { JwtStrategy } from './jwt.strategy';
import { JWTUtil } from './JWTUtil';
@Module({
  imports: [UsersModule, PassportModule,JwtModule.register({
    secret: jwtConstants.secret ,
    signOptions: { expiresIn: '3h' }
  })],
  providers: [AuthService, LocalStrategy , JwtStrategy , JWTUtil],
  exports: [AuthService , JWTUtil ]
})
export class AuthModule {}
