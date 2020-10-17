import { Injectable } from '@nestjs/common';
@Injectable()
export class CustomerMapper {
    constructor() {}
    async customerview(bar) {
        const allowed = ['Name' , 'Email'] 
        const payload = {};
        for (var payloadKey in bar) {
            if( allowed.includes(payloadKey) )
            {
                payload[payloadKey] = bar[payloadKey]
            }
        }
        return payload 
    } 
}

