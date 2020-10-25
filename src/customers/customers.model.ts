import * as mongoose from 'mongoose';

export interface Customer extends mongoose.Document {
    id: string;
    Email: string;
    Password: string;
    Salt: string;
    Role: number;
    Name: string;
    EmailVerify: boolean;
    EmailVerifyToken: string,
    CancelAccount: Boolean,
    Reservations: string[]
    Favourites: string[],
    RePasswordToken: string
  }

