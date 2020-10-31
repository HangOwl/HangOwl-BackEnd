import { Injectable } from '@nestjs/common';
@Injectable()
export class ReservationsMapper {
    constructor() {}
    async view(reservations) {
        if(typeof reservations != 'object') return reservations
        const allowed = ['ResId' , 'CustomerId' , 'BarId' , 'CustomerName' , 'BarName' , 'DateReserve' , 'NumberOfPeople' , 'PostScript' , 'Status' , 'LastModified']
        const payload = {};
        var date 
        var day
        var month
        var year
        for (var payloadKey in reservations) {
            if( allowed.includes(payloadKey) )
            {
                payload[payloadKey] = reservations[payloadKey]
            }
        }
        if ( payload.hasOwnProperty('DateReserve') )
        {
            const DateReserve = ''
            console.log(payload['DateReserve'])
            date = new Date(payload['DateReserve']); 
            day = date.getDate()
            if( day < 10 ) { day = `0${day}`  }
            if( month < 10 ) { month = `0${month}`}
            month = date.getMonth() + 1
            year = date.getFullYear()
            payload['DateReserve'] = `${day}-${month}-${year}`
        }
        if ( payload.hasOwnProperty('LastModified') )
        {
            const DateReserve = ''
            console.log(payload['LastModified'])
            date = new Date(payload['LastModified']); 
            day = date.getDate()
            month = date.getMonth() + 1
            if( day < 10 ) { day = `0${day}`  }
            if( month < 10 ) { month = `0${month}`}
            year = date.getFullYear()
            payload['LastModified'] = `${day}-${month}-${year}`
        }
        return payload 
    } 

    async object_view(reservations) {
        const payload = []
        const it = reservations.values()
        for (var res of it ) {
            payload.push( await this.view(res) )
        }
        return payload
    }


}
