import * as mongoose from 'mongoose';
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
    EmailVerify: boolean;
    EmailVerifyToken: string,
    RePasswordToken: string
  }