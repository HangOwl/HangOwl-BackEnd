import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
    {
        Email: {type: String, required: true},
        Password: {type: String, required: true},
        Salt: {type: String, required: true},
        Role: {type: Number, required: true},
        Name: String,
        EmailVerify: Boolean,
        CancelAccount: Boolean,
        Favourites: [String],
        BarName: String,
        ProfilePicPath : String,
        AdditionalPicPath : [String],
        LineID : String,
        OpenTime : String,
        CloseTime : String,
        CloseWeekDay : [Boolean],
        Address: String,
        AdminApproved : Boolean,
        BarDescription : String,
        BarRule : String,
        Reservations: [String]

    }
    , { collection: 'Users' }
)

export interface User extends mongoose.Document {
    id: string;
    Email: string;
    Password: string;
    Salt: string;
    Role: number;
    Name: String,
    EmailVerify: Boolean,
    CancelAccount: Boolean,
    Favourites: string[],
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