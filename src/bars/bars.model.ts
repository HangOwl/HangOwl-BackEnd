import * as mongoose from 'mongoose';

export const BarSchema = new mongoose.Schema(
    {
        Email: {type: String, required: true},
        Password: {type: String, required: true},
        Salt: {type: String, required: true},
        Role: {type: Number, required: true},
        BarName: {type: String, required: true},
        ProfilePicPath : String,
        AdditionalPicPath : [String],
        LineID : String,
        OpenTime : String,
        CloseTime : String,
        

    }
    , { collection: 'Users' }
)

export interface Bar extends mongoose.Document {
    id: string;
    Email: string;
    Password: string;
    Salt: string;
    Role: number;
    Name: string;
    EmailVerify: boolean;
    CancelAccount: boolean;
    Reservations: string[];
    Favourites: string[];
  }