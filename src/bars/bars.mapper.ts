import { Injectable } from '@nestjs/common';
@Injectable()
export class BarMapper {
    constructor() {}
    async customerview(bar) {
        //const payload = { _id : bar._id , Role : bar.Role , BarName : bar.BarName , }
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