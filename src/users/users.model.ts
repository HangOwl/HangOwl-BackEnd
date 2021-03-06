import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
    {
        Email: {type: String, required: true},
        Password: {type: String, required: true},
        Salt: {type: String, required: true},
        Role: {type: Number, required: true},
        ReEmail: String,
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
        EmergencyCloseDates: [String],
        Address: String,
        AdminApproved : Boolean,
        BarDescription : String,
        BarRule : String,
        Reservations: [String],
        EmailVerifyToken: String,
        RePasswordToken: String,
        ReEmailToken: String,
    }
    , { collection: 'Users' }
)

export interface User extends mongoose.Document {
    id: string;
    Email: string;
    Password: string;
    Salt: string;
    Role: number;
    ReEmail: String,
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
    EmergencyCloseDates: string[];
    Address: string;
    AdminApproved : boolean;
    BarDescription : string;
    BarRule : string;
    Reservations: string[];
    EmailVerifyToken: string,
    RePasswordToken: string,
    ReEmailToken: String,
  }