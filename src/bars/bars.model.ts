import * as mongoose from 'mongoose';

//export const BarSchema = new mongoose.Schema(
//    {
//        Email: {type: String, required: true},
//        Password: {type: String, required: true},
//        Salt: {type: String, required: true},
//        Role: {type: Number, required: true},
//        BarName: {type: String, required: true},
//        ProfilePicPath : String,
//        AdditionalPicPath : [String],
//        LineID : String,
//        OpenTime : String,
//        CloseTime : String,
//        CloseWeekDay : [Boolean],
//        Address: String,
//        AdminApproved : Boolean,
//        BarDescription : String,
//        BarRule : String,
//        Reservations: [String]
//
//    }
//    , { collection: 'Users' }
//)

export interface Bar extends mongoose.Document {
    id: string;
    Email: string;
    Password: string;
    Salt: string;
    Role: number;
    BarName: string;
    ProfilePicPath : string;
    AdditionalPicPath : string[];
    LineID : string;
    OpenTime : string;
    CloseTime : string;
    CloseWeekDay : boolean[];
    Address: string;
    AdminApproved : boolean;
    BarDescription : string;
    BarRule : string;
    Reservations: string[];

  }