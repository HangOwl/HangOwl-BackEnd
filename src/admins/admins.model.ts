import * as mongoose from 'mongoose';

export interface Admin extends mongoose.Document {
    id: string;
    Email: string;
    Password: string;
    Salt: string;
    Role: number;
    Name: string;
  }