import { Injectable, Post } from '@nestjs/common';
import { findSourceMap } from 'module';

export type Reservation = any

@Injectable()
export class ReservationsService{
    private readonly reservations: Reservation[];
    constructor() {
        this.reservations = [
          {
            barId : 'bar1',
            DateReserve : '25jul2020',
            NumberofPeople : '2',
            Postscript : '-',
          },
          {
            barId : 'bar2',
            DateReserve : '19feb2021',
            NumberofPeople : '7',
            Postscript : 'big table',
          },
          {
            barId : 'bar3',
            DateReserve : '19feb2021',
            NumberofPeople : '12',
            Postscript : 'inside',
          },
        ];
      }

    async add_reserve(reserve): Promise<Reservation | undefined>
    {
        //payload in reservation is 'cusId', 'barId', 'DateReserve', 'NumberofPeople', 'Postscript'
        //Doesn't have Status, LastModified
        //Set default
        reserve.Status = 0
        return reserve
    }

    async cus_reserve_list(id): Promise<Reservation | undefined>
    {
        //cusId is string
        return this.reservations.find(reserve => reserve.cusId === id)
    }

    async bar_reserve_list(id): Promise<Reservation | undefined>
    {
        //cusId is string
        return this.reservations.find(reserve => reserve.barId === id)
    }

    async delete_reserve(resId, cusId):  Promise<Reservation | undefined>
    {
        //resId is string, userId is string
        //check cusId in reserve match with cusId
        return "delete reserve complete";
    }

    async edit_reserve(resId, cusId, edit_data): Promise<Reservation | undefined>
    {
        //id is string
        return this.reservations.find(reservation => reservation.resId === resId);
    }

    async approve_reserve(resId, barId): Promise<Reservation | undefined>
    {
        //resId is string, barId is string
        return this.reservations.find(reservation => reservation.resId === resId);
    }

    async delete_all_res(barId, date): Promise<Reservation | undefined>
    {
        //barId is string, date is string
        return "delete all reserve in " + date + " complete";
    }
}