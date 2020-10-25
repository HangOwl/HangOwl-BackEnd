import { Injectable  } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

const base = 'http://localhost:3000'


@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService
  ) {}
  async send_email()  {
    const result = await this.mailerService.sendMail({
        to: 'chalermporn.w@ku.th' , 
        from: 'noreply@gmail.com', 
        subject: 'Hangowl Email Verification', 
        template: 'confirm_email.ejs', 
        context: {  
            link : base + '/auth/verify/' + '1234556',
          },
      })
      return result
  }

  async send_confirm_email( email : string , token : string )
  {
        const result = await this.mailerService.sendMail({
        to: email , 
        from: 'noreply@gmail.com', 
        subject: 'Hangowl Email Verification', 
        template: 'confirm_email.ejs', 
        context: {  
            link : base + '/auth/verify/' + token ,
          },
      })
      if ( result.accepted.length == 1)
        return true
      else
        return false
  }

  async send_change_password_email( email : string , token : string )
  {
    const result = await this.mailerService.sendMail({
      to: email , 
      from: 'noreply@gmail.com', 
      subject: 'Hangowl Change your password ', 
      template: 'change_password_email.ejs', 
      context: {  
          token : token ,
        },
    })
    return result
  }
  async send_approve_reservations(email,Reservation)
  {
      console.log(Reservation)
      const result = await this.mailerService.sendMail({
        to: email , 
        from: 'noreply@gmail.com', 
        subject: 'Hangowl Reservation Accept', 
        template: 'approve_reservation_email.ejs', 
        context: {  
            ReservationId : Reservation._id,
            BarName : Reservation.BarName,
            DateReserve : Reservation.DateReserve,
            NumberOfPeople : Reservation.NumberOfPeople,
            PostScript : Reservation.PostScript
          },
      })
      return result
  }
  async send_reject_reservations(email,Reservation)
  {
      console.log(Reservation)
      const result = await this.mailerService.sendMail({
        to: email , 
        from: 'noreply@gmail.com', 
        subject: 'Hangowl Reservation Reject', 
        template: 'reject_reservation_email.ejs', 
        context: {  
            ReservationId : Reservation._id,
            BarName : Reservation.BarName,
            DateReserve : Reservation.DateReserve,
            NumberOfPeople : Reservation.NumberOfPeople,
            PostScript : Reservation.PostScript
          },
      })
      return result
  }

  async send_reservations(email,Reservation)
  {
      console.log(Reservation)
      const result = await this.mailerService.sendMail({
        to: email , 
        from: 'noreply@gmail.com', 
        subject: 'Hangowl Reservation placed', 
        template: 'place_reservation_email.ejs', 
        context: {  
            ReservationId : Reservation._id,
            BarName : Reservation.BarName,
            DateReserve : Reservation.DateReserve,
            NumberOfPeople : Reservation.NumberOfPeople,
            PostScript : Reservation.PostScript
          },
      })
      return result
  }

}
