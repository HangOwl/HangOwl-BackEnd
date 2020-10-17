import { Module } from '@nestjs/common';
import { BarsService } from './bars.service';
import { MongooseModule } from '@nestjs/mongoose'
import { UserSchema } from 'src/users/users.model'
import { BarMapper } from './bars.mapper'
import { UsersService } from 'src/users/users.service';
@Module({
  imports: [MongooseModule.forFeature([{name: 'User', schema: UserSchema}]) , UsersService],
  providers: [BarsService , BarMapper],
  exports: [BarsService  , BarMapper ],
})
export class BarsModule {}