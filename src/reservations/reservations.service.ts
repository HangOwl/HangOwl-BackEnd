import { Injectable, Post, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { findSourceMap } from 'module';
import { Model } from 'mongoose'
import { ReservationsModule } from './reservations.module';
import { User } from 'src/users/users.model';
import { Bar } from 'src/bars/bars.model';
import { Customer } from 'src/customers/customers.model';

export type Reservation = any

@Injectable()
export class ReservationsService{
    private readonly reservations: Reservation[];
    constructor(
        @InjectModel('User') private readonly customerModel: Model<Customer>,
        @InjectModel('User') private readonly barModel: Model<Bar>,
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('Reservation') private readonly reservationModel: Model<Reservation>
    ) {}
    async getToday()
    {
        var today = await new Date();
        var date = await today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = await (today.getHours()+7) + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = await date+' '+time;
        return dateTime;
    }
    async add_reserve(reservation)
    {
        //payload in reserve is [ 'CustomerId','BarId','DateReserve', 'NumberOfPeople', 'PostScript' ]
        //Doesn't have Status, LastModified
        //Set default
        let bar;
        bar = await this.barModel.findById(reservation.BarId);
        if (!bar){
            return "Could not find bar.";
        }
        else if (bar.Role != 1){
            return "user from BarId is not bar";
        }
        let customer;
        customer = await this.customerModel.findById(reservation.CustomerId);
        const newReservation = new this.reservationModel({
            CustomerId : reservation.CustomerId,
            BarId : reservation.BarId,
            CustomerName : customer.Name,
            BarName : bar.BarName,
            DateReserve : reservation.DateReserve,
            NumberOfPeople : reservation.NumberOfPeople,
            PostScript : reservation.NumberOfPeople,
            Status: 0,
            LastModified : await this.getToday()
          });
        const result = await newReservation.save()
        customer.Reservations.push(result.id);
        customer.save()
        bar.Reservations.push(result.id);
        bar.save()
        return result;
    }

    async cus_reserve_list(id)
    {
        //cusId is string
        const reservation = await this.reservationModel.find({'CustomerId' : id }).exec();
        return reservation
    }

    async bar_reserve_list(id)
    {
      const reservation = await this.reservationModel.find({'BarId' : id }).exec();
        return reservation
    }

    async delete_reserve(resId, cusId)
    {
        //resId is string, userId is string
        //check cusId in reserve match with cusId
        let updatedReservation;
        updatedReservation = await this.reservationModel.findById(resId);
        if (updatedReservation.CustomerId != cusId){
            return "Your CustomerId not match with reservation CustomerId"
        }

        //update reservation status
        updatedReservation.Status = 3;
        
        //remove reservation from bar and customer
        let updatedCustomer;
        updatedCustomer = await this.customerModel.findById(updatedReservation.CustomerId);
        await updatedCustomer.updateOne({ $pull: {"Reservations": resId } } );
        updatedCustomer.save() 

        let updatedBar;
        updatedBar = await this.barModel.findById(updatedReservation.BarId);
        await updatedBar.updateOne({ $pull: {"Reservations": resId } } );
        updatedBar.save()  
    
        
        const result = await updatedReservation.save();
        return result.Status;
    }

    async edit_reserve(resId, cusId, edit_data)
    {
        //id is string
        const editable = [ 'DateReserve' , 'NumberOfPeople' , 'PostScript'] 
        let reservation;
        reservation = await this.reservationModel.findById(resId);
        if (reservation.CustomerId != cusId){
          return "Your Id not match with reservation CustomerId"
      }

        for (var editkey in edit_data ) {
          if( editable.includes(editkey) )
          {
            reservation[editkey] = edit_data[editkey]
          }
        }
        reservation['LastModified'] = await this.getToday()
        const result = await reservation.save()
        return result
    }

    async approve_reserve(resId, barId)
    {
        let updatedReservation;
        updatedReservation = await this.reservationModel.findById(resId);
        if (updatedReservation.BarId != barId){
            return "Your BarId not match with reservation BarId"
        }
        updatedReservation.Status = 1;
        const result = await updatedReservation.save();
        return result.Status;
    }

    async delete_all_res(barId, date)
    {
        //barId is string, date is string
        return "delete all reserve in " + date + " complete";
    }
}