import { Injectable } from '@nestjs/common';

const bcrypt = require('bcrypt')

export type Customer = any
@Injectable()
export class CustomersService{
    private readonly customers: Customer[];
    constructor() {
        this.customers = [
          {
            userId: '11',
            Name: 'tham',
            Email: 'tham_za@xx.th',
            Password: 'thamza43',
            Favourites: ['ChangChang', 'Alibaba', 'Undorm']
          },
          {
            userId: '12',
            Name: 'kenchi',
            Email: 'kenchichy@xx.th',
            Password: 'Kken123',
            Favourites: ['ChangChang', 'Undorm']
          },
          {
            userId: '13',
            Name: 'aurora',
            Email: 'a0378@xx.th',
            Password: '123',
            Favourites: ['Alibaba', 'Pterpan']
          },
        ];
      }
    
      async add_customer(customer): Promise<Customer | undefined>
      {
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
          return null
        //Generate encrpte password
        customer.Salt = await bcrypt.genSalt(10)
        customer.Password = await bcrypt.hash(customer.Password , customer.Salt )
        //adding customer procedure
        
        //email procedure
        return customer
    }

    async customer_data(id): Promise<Customer | undefined>
    {
        //return customer that match with id
        //id is string
        return this.customers.find(customer => customer.userId === id);
    } 

    async customer_favbars(id): Promise<Customer | undefined>
    {
        //return list of favourite bar's customer that match with id
        //id is string
        return this.customers.find(customer => customer.userId === id).Favourites;
    } 

    async add_favbars(userId, barId): Promise<Customer | undefined>
    {
        //userId is string , barId is string
        return "add favorite bar complete";
    }

    async remove_favbars(userId, barID): Promise<Customer | undefined>
    {
        //userId is string , barId is string
        return "remove favorite bar complete";
    }

    async edit_customer(id, edit_data): Promise<Customer | undefined>
    {
        //id is string
        //Edit Password
        if(edit_data.Password){
          edit_data.Salt = await bcrypt.genSalt(10)
          edit_data.Password = await bcrypt.hash(edit_data.Password , edit_data.Salt )
        }
        return this.customers.find(customer => customer.userId === id);
    }

}