import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bar } from './bars.model';
import { User } from 'src/users/users.model';
import { BarsModule } from './bars.module';
import { Model } from 'mongoose'
import { EmailService } from 'src/email.service';
import { ReservationsService } from 'src/reservations/reservations.service'
const bcrypt = require('bcrypt')


@Injectable()
export class BarsService{
    private readonly bars: Bar[];
    constructor(
      @InjectModel('User') private readonly barModel: Model<Bar>,
      @InjectModel('User') private readonly userModel: Model<User>,
      private emailService: EmailService,
      private reservationService : ReservationsService
      ) {}
    async list_bars()  {
        const bars = await this.barModel.find({"AdminApproved":true, "Role":1}).exec();
        return bars;
    }
    async list_unapprove_bars()  {
      const bars = await this.barModel.find({"AdminApproved":false, "Role":1}).exec();
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
          return 'Bad email format.'
        if ( bar.OpenTime.length != 4 || bar.CloseTime.length != 4 )
          // Bad time format
          return 'Bad time format.'
        if ( typeof bar.CloseWeekDay != 'object' || bar.CloseWeekDay.length != 7 )
          // Bad Close week Days format
          return 'Bad CloseWeekDay format.'
        
        // Generate encrpte password
        bar.salt = await bcrypt.genSalt(10)
        bar.Password = await bcrypt.hash(bar.Password , bar.salt )
        bar.token = ''
        for (var i = 0; i < 8; i++) {
            bar.token += Math.random().toString(36).substring(5)
        }
        //send_email
        if( ! await this.emailService.send_confirm_email(bar.Email , bar.token))
        { 
          return "Email verification send fail"
        }
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
          EmergencyCloseDates: [],
          Address: bar.Address,
          AdminApproved : false,
          BarDescription : bar.BarDescription,
          BarRule : bar.BarRule,
          Reservations: [],
          EmailVerify: false,
          EmailVerifyToken: bar.token,
          RePasswordToken: ''
        });
        const result = await newBar.save();
        console.log(result);
        //email procedure
        return result.id as string;
    }
  
    async edit_bar(id,edit_content)
    {
        //editing bar procedure
        
        if( edit_content.hasOwnProperty('Password') )
        {
          if(edit_content.hasOwnProperty('Salt')) return "Invalid content"
          edit_content.Salt = await bcrypt.genSalt(10)
          edit_content.Password = await bcrypt.hash(edit_content.Password , edit_content.salt )
        }
        const editable = [ 'BarName' , 'OpenTime' , 'CloseTime' , 'Salt' , 'Password' , 'CloseWeekDay' , 'LineID' , 'Email' , 'Address' , 'BarDescription' ,
                           'BarRule'] 
        if(edit_content.Email) {
          if(await this.userModel.findOne({'Email':edit_content.Email})) return "Email already exist."
        }
        if(edit_content.BarName){
          //edit all reservation.BarName
          this.change_reservations_bar_name(id, edit_content.BarName)
        }

        //update bar
        let updatedBar = await this.bar_profile(id);
        for (var editkey in edit_content ) {
          if( editable.includes(editkey) )
          {
            updatedBar[editkey] = edit_content[editkey]
          }
        }
        
        if(edit_content.CloseWeekDay){
          //reject all reservation according to new CloseWeekDay
          this.reservationService.reject_res_new_close_weekday(updatedBar)
        }
        const result = await updatedBar.save()
        return result
    }

    
    async change_reservations_bar_name(id , name){
        let updatedReservations
        updatedReservations = await this.reservationService.bar_reserve_list(id)
        console.log(updatedReservations)
        let i
        for(i in updatedReservations)
        {
          updatedReservations[i]['BarName'] = name
          const result = await updatedReservations[i].save()
        }
    }
    async bar_profile(id)
    {
        //return  bar that match with id
        //id is string
        let bar;
        try {
          bar = await this.barModel.findById(id);
        }catch(error){
          throw new NotFoundException('Could not find bar.');
        }
        if (!bar) {
          throw new NotFoundException('Could not find bar.');
        }
        if(bar.Role != 1){
          return "This is not barId";
        }
        return bar;
    }
    
    async bar_search(search_text)
    {
      console.log ('search_bar');
      //search_text is Barname
      let bars;
      try{
      bars = await this.barModel.find({ BarName: { $regex: search_text, $options: "i" } , "AdminApproved":true });
      }catch(error){
        throw new NotFoundException('Could not find bar.');
      }if (!bars) {
        throw new NotFoundException('Could not find bar.');
      }
      return bars;
    }

    async additonal_picture_add(id, filename)
    {
      // add additional picture
      console.log ("additional pic add")
      const updatedBar = await this.bar_profile(id);
      updatedBar.AdditionalPicPath.push(filename);
      updatedBar.save();
      return updatedBar.AdditionalPicPath;
    }

    async profile_picture_add(id, filename)
    {
      // add profile picture
      const updatedBar = await this.bar_profile(id);
      updatedBar.ProfilePicPath = filename;
      updatedBar.save()
      return updatedBar.ProfilePicPath;
    }

    async additonal_picture_remove(id, filename)
    {
      // remove additional picture
      let updatedBar = await this.bar_profile(id);
      await updatedBar.updateOne({ $pull: {"AdditionalPicPath": filename } } );
      const result = await updatedBar.save()
      return result.AdditionalPicPath;
    }

    async approve_bar(id)
    {
      // approve bar , id is string of bar_id
      let updatedBar = await this.bar_profile(id);
      updatedBar.AdminApproved = true;
      updatedBar.save()
      return updatedBar.AdminApproved;
    }
    
}
