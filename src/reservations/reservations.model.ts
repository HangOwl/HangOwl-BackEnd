import * as mongoose from 'mongoose';

export const ReservationSchema = new mongoose.Schema(
    {
        CustomerId : {type: String, required: true},
        BarId : {type: String, required: true},
        CustomerName : {type: String, required: true},
        BarName : {type: String, required: true},
        DateReserve : {type: Date, required: true},
        NumberOfPeople: {type: Number, required:true},
        PostScript: String,
        Status: Number,
        //Status 0 pending 1 accept 2 reject 3 cancel
        LastModified: {type: Date, required: true}
    }
    , { collection: 'Reservations' }
)

export interface User extends mongoose.Document {
    id: string;
    CustomerId : string;
    BarId : string;
    CustomerName : string;
    BarName : string;
    DateReserve : string;
    NumberOfPeople : string;
    PostScript : string;
    Status : number;
    LastModified : string;
  }