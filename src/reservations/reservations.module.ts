import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { MongooseModule } from '@nestjs/mongoose'
import { ReservationSchema } from './reservations.model'
import { UserSchema } from 'src/users/users.model'
import { EmailService } from 'src/email.service';
import { CustomersService } from 'src/customers/customers.service'
import { ReservationsMapper } from './reservations.mapper'
@Module({
  imports: [MongooseModule.forFeature([{name: 'Reservation', schema: ReservationSchema},{name: 'User', schema: UserSchema}])],
  providers: [ ReservationsService , ReservationsModule , EmailService , CustomersService , ReservationsMapper] ,
  exports: [ ReservationsService  , ReservationsModule , ReservationsMapper ],
})

export class ReservationsModule {}