import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bar } from './bars.model';
import { User } from 'src/users/users.model';
import { BarsModule } from './bars.module';
import { Model } from 'mongoose'
const bcrypt = require('bcrypt')


@Injectable()
export class BarsService{
    private readonly bars: Bar[];
    constructor(
      @InjectModel('User') private readonly barModel: Model<Bar>,
      @InjectModel('User') private readonly userModel: Model<User>
      ) {}
    async list_bars()  {
        const bars = await this.barModel.find().exec();
        return bars;
    }
    async add_bar(bar): Promise<string>
    {
        const user = await this.userModel.findOne({'Email':bar.Email});
        if(user)
          return "Email already exist.";
        //payload in bar is  'Email','Password' ,'BarName','LineID','OpenTime','CloseTime','CloseWeekDay','Address' , 'BarDescription', 'BarRule'
        // Doesn't have Role , ProfilePicPath , AdditionalPicture 
        // Set default
        bar.Role = 1
        bar.ProfilePicPath = ""
        bar.AdditionalPicture = []
        // Check if is true format
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if ( ! re.test(String(bar.Email).toLowerCase()) ) 
          // Bad email format
          return null
        if ( bar.OpenTime.length != 4 || bar.CloseTime.length != 4 )
          // Bad time format
          return null
        if ( typeof bar.CloseWeekDay != 'object' || bar.CloseWeekDay.length != 7 )
          // Bad Close week Days format
          return null
        
        // Generate encrpte password
        bar.salt = await bcrypt.genSalt(10)
        bar.Password = await bcrypt.hash(bar.Password , bar.salt )
        //adding bar procedure

        const newBar = new this.barModel({
          Email: bar.Email,
          Password: bar.Password,
          Salt: bar.salt,
          Role: bar.Role,
          BarName: bar.BarName,
          ProfilePicPath : bar.ProfilePicPath,
          AdditionalPicPath : bar.AdditionalPicPath,
          LineID : bar.LineID,
          OpenTime : bar.OpenTime,
          CloseTime : bar.CloseTime,
          CloseWeekDay : bar.CloseWeekDay,
          Address: bar.Address,
          AdminApproved : false,
          BarDescription : bar.BarDescription,
          BarRule : bar.BarRule,
          Reservations: [],
        });
        const result = await newBar.save();
        console.log(result);
        //email procedure
        return result.id as string;
    }
  

    async edit_bar(id,bar)
    {
 
        bar.Role = 1
        // Check if is true format
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if ( ! re.test(String(bar.Email).toLowerCase()) ) 
          // Bad email format
          return null
        if ( bar.OpenTime.length != 4 || bar.CloseTime.length != 4 )
          // Bad time format
          return null
        if ( typeof bar.CloseWeekDay != 'object' || bar.CloseWeekDay.length != 7 )
          // Bad Close week Days format
          return null
        // Generate encrpte password
        bar.salt = await bcrypt.genSalt(10)
        bar.Password = await bcrypt.hash(bar.Password , bar.salt )
        //editing bar procedure
        
        return bar
    }

    async bar_profile(id): Promise<Bar | undefined>
    {
        //return  bar that match with id
        //id is string
        let bar;
        try {
          bar = await this.barModel.findById(id);
        }catch(error){
          throw new NotFoundException('Could not find product.');
        }
        if (!bar) {
          throw new NotFoundException('Could not find product.');
        }
        return bar;
    }

    async bar_search(search_text): Promise<Bar | undefined>
    {
        
    }

}
