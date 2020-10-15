import { Injectable, Post } from '@nestjs/common';

export type Reservation = any

@Injectable()
export class ReservationsService{
    private readonly reservations: Reservation[];
    constructor() {
        this.reservations = [
          {
            cusId : 'cus529',
            barId : 'bar1',
            DateReserve : '25jul2020',
            NumberofPeople : '2',
            Postscript : '-',
          },
          {
            cusId : 'cus456',
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
        //Get LastModified
        reserve.LastModified = Date().toString();
        return reserve
    }

    


}