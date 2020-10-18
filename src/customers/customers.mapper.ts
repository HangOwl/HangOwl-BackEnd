import { Injectable } from '@nestjs/common';
@Injectable()
export class CustomerMapper {
    constructor() {}
    async customerview(customer) {
        if(typeof customer != 'object') return customer
        const allowed = ['Name' , 'Email' , 'Reservations'] 
        const payload = {};
        for (var payloadKey in customer) {
            if( allowed.includes(payloadKey) )
            {
                payload[payloadKey] = customer[payloadKey]
            }
        }
        return payload 
    } 
}

