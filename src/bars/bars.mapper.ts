import { Injectable } from '@nestjs/common';
@Injectable()
export class BarMapper {
    constructor() {}
    async customerview(bar) {
        const allowed = ['AdditionalPicPath' , 'CloseWeekDay' , '_id' , 'Role' , 'BarName' , 
                         'ProfilePicPath' , 'LineID' , 'OpenTime' , 'CloseTime' , 'Address' , 'AdminApproved' , 'BarDescription' , 'BarRule']
        const payload = {};
        for (var payloadKey in bar) {
            if( allowed.includes(payloadKey) )
            {
                payload[payloadKey] = bar[payloadKey]
            }
        }
        return payload
    }

    async barview(bar) {
        const allowed = ['AdditionalPicPath' , 'CloseWeekDay' , '_id' , 'Role' , 'BarName' , 'Email' ,
                         'ProfilePicPath' , 'LineID' , 'OpenTime' , 'CloseTime' , 'Address' , 'AdminApproved' , 'BarDescription' , 'BarRule']
        const payload = {};
        for (var payloadKey in bar) {
            if( allowed.includes(payloadKey) )
            {
                payload[payloadKey] = bar[payloadKey]
            }
        }
        return payload
    }

    async object_barview(bars) {
        const payload = []
        const it = bars.values()
        for (var bar of it ) {
            payload.push( await this.barview(bar) )
        }
        return payload
    }

    async object_customerview(bars) {
        const payload = []
        const it = bars.values()
        for (var bar of it ) {
            payload.push( await this.customerview(bar) )
        }
        return payload
    }
}


/*
    {
        "Favourites": [],
        "AdditionalPicPath": [],
        "CloseWeekDay": [
            true,
            false,
            false,
            true,
            false,
            false,
            true
        ],
        "Reservations": [],
        "_id": "5f8686efe7b26f06597255cc",
        "Email": "Drunkorca@gmail.com",
        "Password": "$2b$10$TRz6TzChMcD5O3ntg78FGuXUNqxvLLHmLrVlBQU4c0zWkRcOhdGJ2",
        "Salt": "$2b$10$TRz6TzChMcD5O3ntg78FGu",
        "Role": 1,
        "BarName": "DrinkOrca",
        "ProfilePicPath": "",
        "LineID": "@DrunkOrca",
        "OpenTime": "1800",
        "CloseTime": "0200",
        "Address": "Pacific Ocean",
        "AdminApproved": false,
        "BarDescription": "Don't eat salmon we really need them",
        "BarRule": "Human must eat salmon from farm only!!!",
        "__v": 0
    },
*/