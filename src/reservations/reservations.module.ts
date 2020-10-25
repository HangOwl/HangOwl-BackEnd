import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { MongooseModule } from '@nestjs/mongoose'
import { ReservationSchema } from './reservations.model'
import { UserSchema } from 'src/users/users.model'
import { EmailService } from 'src/email.service';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Reservation', schema: ReservationSchema},{name: 'User', schema: UserSchema}])],
  providers: [ ReservationsService , ReservationsModule, EmailService  ],
  exports: [ ReservationsService  , ReservationsModule ],
})

export class ReservationsModule {}