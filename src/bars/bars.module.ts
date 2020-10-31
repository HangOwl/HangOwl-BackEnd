import { Module } from '@nestjs/common';
import { BarsService } from './bars.service';
import { MongooseModule } from '@nestjs/mongoose'
import { UserSchema } from 'src/users/users.model'
import { BarMapper } from './bars.mapper'
import { EmailService } from 'src/email.service';
import { ReservationsModule } from 'src/reservations/reservations.module';
@Module({
  imports: [MongooseModule.forFeature([{name: 'User', schema: UserSchema}]), ReservationsModule],
  providers: [BarsService , BarMapper , EmailService ],
  exports: [BarsService  , BarMapper ],
})
export class BarsModule {}