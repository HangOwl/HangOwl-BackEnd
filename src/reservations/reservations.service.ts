import { Injectable, Post, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { findSourceMap } from 'module';
import { Model } from 'mongoose'
import { ReservationsModule } from './reservations.module';
import { User } from 'src/users/users.model';
import { Bar } from 'src/bars/bars.model';
import { Customer } from 'src/customers/customers.model';
import { EmailService } from 'src/email.service';
import { concat } from 'rxjs';
export type Reservation = any

@Injectable()
export class ReservationsService{
    private readonly reservations: Reservation[];
    constructor(
        @InjectModel('User') private readonly customerModel: Model<Customer>,
        @InjectModel('User') private readonly barModel: Model<Bar>,
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('Reservation') private readonly reservationModel: Model<Reservation>,
        private emailService: EmailService,
    ) {} 
    async findByResId(ResId){
        let reservation 
        try {
            reservation = await this.reservationModel.findOne({"ResId":ResId})
        }catch(error){
            throw new NotFoundException('Could not find reservation.');
        }
        if (!reservation) {
            throw new NotFoundException('Could not find reservation.');
        }
        return reservation
    }

    async getDayOfWeek(date) {
        //date format is 2020-10-31
        const dayOfWeek = new Date(date).getDay();
        console.log(dayOfWeek)    
        return isNaN(dayOfWeek) ? null : 
            [0,1,2,3,4,5,6][dayOfWeek]
    }
    async getToday()
    {
        var today = await new Date();
        var date = await today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = await (today.getHours()) + ":" + today.getMinutes() + ":" + today.getSeconds();
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
        //let DateReserve = new Date(reservation.DateReserve)
        //if( DateReserve < Today ) return "Date reserve is invalid"
        //genId is random id
        //resId is reservation id
        let resId;
        let genId;
        do{
            genId = '';
            resId = '';
            for (var i = 0; i < 2; i++) {
                genId += Math.random().toString(36).substring(5)
            }
            //get first 10 characters from genId
            for (var i = 0; i < 10; i++){
                resId += genId[i]
            }
        }while(await this.reservationModel.findOne({'id':resId}))
        // id is after hereeee
        let customer;
        customer = await this.customerModel.findById(reservation.CustomerId);
        let DateOfWeekReserve = await this.getDayOfWeek(reservation.DateReserve);
        
        //find if datereserve is close by weekday
        if(bar.CloseWeekDay[DateOfWeekReserve]){
            return "Bar not open"
        }
        
        const newReservation = new this.reservationModel({
            ResID: resId,
            CustomerId : reservation.CustomerId,
            BarId : reservation.BarId,
            CustomerName : customer.Name,
            BarName : bar.BarName,
            DateReserve : reservation.DateReserve,
            DateOfWeekReserve : DateOfWeekReserve,
            NumberOfPeople : reservation.NumberOfPeople,
            PostScript : reservation.PostScript,
            Status: 0,
            LastModified : await this.getToday()
          });
        const result = await newReservation.save()
        this.emailService.send_reservations(customer.Email, result);
        customer.Reservations.push(result.id);
        customer.save()
        bar.Reservations.push(result.id);
        bar.save()
        return result;
    }

    async cus_reserve_list(id)
    {
        //cusId is string
        //const reservation = await this.reservationModel.find({'CustomerId' : id , 'Status' : { $ne: 3 } }).exec();
        let customer;
        customer = await this.customerModel.findById(id);
        let reservations;
        reservations = await this.reservationModel.find({
          '_id' : {$in: customer.Reservations}
        }).sort([["Status",1],["DateReserve", 1], ["LastModified",1]]);
        return reservations
        //return reservation
    }

    async bar_reserve_list(id)
    {
        //const reservation = await this.reservationModel.find({'BarId' : id , 'Status' : { $ne: 3 } }).exec();
        //return reservation
        let bar;
        bar = await this.customerModel.findById(id);
        let reservations;
        reservations = await this.reservationModel.find({
          '_id' : {$in: bar.Reservations}
        }).sort([["Status",1],["DateReserve", 1], ["LastModified",1]]);
        return reservations
        //return reservation
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
        //let updatedCustomer;
        //updatedCustomer = await this.customerModel.findById(updatedReservation.CustomerId);
        //await updatedCustomer.updateOne({ $pull: {"Reservations": resId } } );
        //updatedCustomer.save() 

        //let updatedBar;
        //updatedBar = await this.barModel.findById(updatedReservation.BarId);
        //await updatedBar.updateOne({ $pull: {"Reservations": resId } } );
        //updatedBar.save()  
    
        
        const result = await updatedReservation.save();
        return result.Status;
    }

    async edit_reserve(resId, cusId, edit_data)
    {
        //id is string
        const editable = [ 'DateReserve' , 'NumberOfPeople' , 'PostScript'] 
        let reservation;
        reservation = await this.findByResId(resId);
        if (reservation.CustomerId != cusId){
          return "Your Id not match with reservation CustomerId"
        }
        if (reservation.Status != 0) {
          return "You can not edit approved or deleted reservations"
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
        updatedReservation = await this.findByResId(resId);
        if (updatedReservation.BarId != barId){
            return "Your BarId not match with reservation BarId"
        }
        if (updatedReservation.Status != 0) {
            return "You can not edit non pending reservations"
        }
        updatedReservation.Status = 1;
        const result = await updatedReservation.save();

        let customer;
        customer = await this.customerModel.findById(updatedReservation.CustomerId);
        this.emailService.send_approve_reservations(customer.Email, updatedReservation);
        return result.Status;
    }
    async reject_res_new_close_weekday(bar){
        let updatedReservations;
        for(let i in bar.CloseWeekDay){
            if(bar.CloseWeekDay[i]){
                //get all rervation in bar that has new close day and DateReserve is greater or equal than today
                updatedReservations = await this.reservationModel.find({
                    '_id' : {$in: bar.Reservations},
                    'DateOfWeekReserve' : i ,
                    'DateReserve': { $gte: await this.getToday() }
                })
                
            //reject all reservation that you can find 
            for(let j in updatedReservations){
                if(updatedReservations[j].Status == 2)
                {
                    continue
                }
                //console.log(updatedReservations[j])
                
                this.reject_reserve(updatedReservations[j].ResId, bar.id)
            }
          }
        }
    }
    async reject_reserve(resId, barId)
    {
        let updatedReservation;
        updatedReservation = await this.findByResId(resId);
        //console.log('rejecting ... ' , resId , updatedReservation['BarId'] , barId )
        //console.log('reservation data : ' , updatedReservation )
        if (updatedReservation.BarId != barId){
            return "Your BarId not match with reservation BarId"
        }
        if (updatedReservation.Status != 0) {
            return "You can not edit non pending reservations"
        }
        updatedReservation.Status = 2;
        const result = await updatedReservation.save();

        let customer;
        customer = await this.customerModel.findById(updatedReservation.CustomerId);
        
        this.emailService.send_reject_reservations(customer.Email, updatedReservation);
        return result.Status;
    }

    async delete_all_res(barId, date)
    {
        //barId is string, date is string
        //Date format from mongodb is "2020-10-20T00:00:00.000+00:00"
        //resId is string, userId is string
        //check cusId in reserve match with cusId
        let bar;
        bar = await this.barModel.findById(barId);
        let reservations;
        reservations = await this.reservationModel.find({
            '_id' : {$in: bar.Reservations},
            'DateReserve' : date,
            'Status': { $in: [0, 1] }
          });
        let i;
        let CustomerEmails = [];
        let customer;
        let CustomerId;
        for(i in reservations){
            CustomerId = reservations[i]['CustomerId']
            customer = await this.customerModel.findById(CustomerId)
            if (!CustomerEmails.includes(customer['Email']))
            {
                CustomerEmails.push(customer['Email'])
            }
            reservations[i].Status = 3;
            reservations[i].save()
        }
        //console.log(CustomerEmails)
        //console.log(reservations) 
        //CustomerEmails contain list of email to send
        //sendtoEmail is string of CustomerEmails
        let sendtoEmail = '';
        for(var j = 0; j<CustomerEmails.length; j++){
            sendtoEmail += CustomerEmails[j]
            if(j<CustomerEmails.length-1){
                sendtoEmail += ',';
            }
            console.log(sendtoEmail) 
        }
        console.log(sendtoEmail)
        this.emailService.send_emergency_close_email(sendtoEmail, bar, date, reservations);
        return 'Success'
    }
}