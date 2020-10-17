import { Controller , Get, Param, Post, Request, UseGuards, Headers, Delete, Patch} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { JWTUtil } from 'src/auth/JWTUtil';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BarsService } from 'src/bars/bars.service';
import { CustomerMapper } from './customers.mapper';
import { BarMapper } from 'src/bars/bars.mapper';

@Controller('customers')
export class CustomersController {

    constructor(private readonly customerservice: CustomersService ,
                private readonly jwtUtil: JWTUtil , 
                private readonly barservice: BarsService , 
                private customermapper: CustomerMapper , 
                private barmapper: BarMapper ) {}

    @Post()
    add_new_customer(@Request() req): any {
        const payload = {'Email' : req.body.Email , 'Password' : req.body.Password, 'Name' : req.body.Name}
        //check if Value is Null
        for (const payloadKey of Object.keys(payload)) {
            if( payload[payloadKey] == null)
            {
                return payloadKey.concat(' ' , 'can not be null.')
            }
        }
        return this.customerservice.add_customer(payload)
    }
    
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    get_certain_customers(@Param('id') id, @Headers('Authorization') auth : string): any{
        //check userId
        const current_user = this.jwtUtil.decode(auth); // id , Role
        if(current_user._id != id && current_user.Role != 1 ){
            return "userId not match"
        }
    return this.customermapper.customerview ( this.customerservice.customer_data(id) ) ;

    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/favbars')
    async get_favourite_bar(@Param('id') id, @Headers('Authorization') auth : string) {
        //check userId
        const current_user = this.jwtUtil.decode(auth); // id , Role
        if(current_user._id != id && current_user.Role != 1 ){
            return "userId not match"
        }
    return this.barmapper.object_customerview( await this.customerservice.customer_favbars(id) );
    //return this.customerservice.customer_favbars(id) ;

    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/favbars')
    async add_favorite_bar(@Param('id') id, @Request() req, @Headers('Authorization') auth : string ) {
        //check userId
        const current_user = this.jwtUtil.decode(auth); // id , Role
        if(current_user._id != id && current_user.Role != 1 ){
            return "userId not match"
        }
        /*
        if(current_user.Role != 0){
            return "You are not customer"
        }
        */
        if(req.body.barId == null){
            return null
        } 
        //check userId
        await this.barservice.bar_profile(req.body.barId)
        return this.customerservice.add_favbars(id, req.body.barId) 

    }
    
    @UseGuards(JwtAuthGuard)
    @Delete(':cusID/favbars/:barID')
    async remove_favorite_bar(@Param('cusID') cusId, @Param('barID') barId, @Headers('Authorization') auth : string) {
        //check userId
        const current_user = this.jwtUtil.decode(auth); // id , Role
        if(current_user._id != cusId && current_user.Role != 1 ){
            return "userId not match"
        }

        return  await this.customerservice.remove_favbars(cusId, barId)    
    } 

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update_customer_data(@Param('id') id, @Request() req, @Headers('Authorization') auth : string): any{
        //check userId
        const current_user = this.jwtUtil.decode(auth); // id , Role
        if(current_user._id != id && current_user.Role != 1  ){
            return "userId not match"
        }
        return this.customerservice.edit_customer(id, req.body);
    }



}