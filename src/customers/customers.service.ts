import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from './customers.model';
import { User } from 'src/users/users.model';
import { CustomersModule } from './customers.module';
import { Model } from 'mongoose'
import { Bar } from 'src/bars/bars.model';

const bcrypt = require('bcrypt')


@Injectable()
export class CustomersService{
    private readonly customers: Customer[];
    constructor(
      @InjectModel('User') private readonly customerModel: Model<Customer>,
      @InjectModel('User') private readonly userModel: Model<User>,
      @InjectModel('User') private readonly barModel: Model<Bar>
    ) {}
    
    async add_customer(customer)
    {
        const user = await this.userModel.findOne({'Email':customer.Email});
        if(user)
          return "Email already exist.";
        //payload in customer is 'Email', 'Password', 'Name'
        //Doesn't have Role, EmailVerify, CancelAccount, Reservations, Favourites
        //Set default
        customer.Role = 0
        customer.EmailVerify = false
        customer.CancelAccount = false
        customer.Reservations = []
        customer.Favourites = []
        //Check if is true format
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if ( ! re.test(String(customer.Email).toLowerCase()) ) 
          //Bad email format
          return "Bad email format"
        //Generate encrpte password
        customer.Salt = await bcrypt.genSalt(10) 
        customer.Password = await bcrypt.hash(customer.Password , customer.Salt )
        //adding customer procedure
        const newCustomer = new this.customerModel({
          Email: customer.Email,
          Password: customer.Password,
          Salt: customer.Salt,
          Role: customer.Role,
          Name: customer.Name,
          EmailVerify: customer.EmailVerify,
          Reservations: customer.Reservations,
          Favourites: customer.Favourites,
        });
        const result = await newCustomer.save();
        console.log(result);
        //email procedure
        return result.id as string;
    }

    async customer_data(id)
    {
        //return customer that match with id
        //id is string
        let customer;
        try {
          customer = await this.customerModel.findById(id);
        }catch(error){
          throw new NotFoundException('Could not find customer.');
        }
        if (!customer) {
          throw new NotFoundException('Could not find customer.');
        }
        if(customer.Role != 0){
          return "This is not customerId"
        }
        return customer;
    } 

     async customer_favbars(id): Promise<Customer | undefined>
     {
         //return list of favourite bar's customer that match with id
         //id is string
         let customer;
         customer = await this.customer_data(id);
         let bars;
         bars = await this.barModel.find({
           '_id' : {$in: customer.Favourites}
         });
         return bars;
     } 

    async add_favbars(cusId, barId)
    {
        //cusId is string , barId is string
        let bar;
        try {
          bar = await this.barModel.findById(barId);
        }catch(error){
          throw new NotFoundException('Could not find bar.');
        }
        if (!bar) {
          throw new NotFoundException('Could not find bar.');
        }
        if (bar.Role != 1){
          return "This is not barId";
        }
        let updatedCustomer;
        updatedCustomer = await this.customer_data(cusId);
        if (updatedCustomer.Favourites.includes(barId)){
          return "This bar already exists";
        }
        updatedCustomer.Favourites.push(barId);
        updatedCustomer.save();
        return updatedCustomer.Favourites;
    }

    async remove_favbars(cusId, barId)
    {
      //cusId is string , barId is string
      let updatedCustomer;
      updatedCustomer = await this.customer_data(cusId); 
      await updatedCustomer.updateOne({ $pull: {"Favourites": barId } } );
      let result = await updatedCustomer.save()
      return result;  
    }

    async edit_customer(id, edit_content)
    {
        //editing bar procedure
        //
        if( edit_content.hasOwnProperty('Password') )
        {
          if(edit_content.hasOwnProperty('Salt')) return "Invalid content"
          edit_content.Salt = await bcrypt.genSalt(10)
          edit_content.Password = await bcrypt.hash(edit_content.Password , edit_content.salt )
        }
        const editable = [ 'Name' , 'Salt' , 'Password' , 'Email'] 
        if(edit_content.Email) {
          if(await this.userModel.findOne({'Email':edit_content.Email})) return "Email already exists"
        }
        let updatedCustomer = await this.customer_data(id);
        for (var editkey in edit_content ) {
          if( editable.includes(editkey) )
          {
            updatedCustomer[editkey] = edit_content[editkey]
          }
        }
        const result = await updatedCustomer.save()
        return result
    }

}