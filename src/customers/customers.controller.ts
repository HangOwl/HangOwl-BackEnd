import { Controller , Get, Param, Post, Request, UseGuards, Headers, Delete, Patch} from '@nestjs/common'
import { CustomersService } from './customers.service'
import { AppService } from 'src/app.service';
import { JWTUtil } from 'src/auth/JWTUtil';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { identity } from 'rxjs';
import { BarsService } from 'src/bars/bars.service';

@Controller('customers')
export class CustomersController {

    constructor(private readonly customerservice: CustomersService ,
                private readonly jwtUtil: JWTUtil , 
                private readonly barservice: BarsService) {}

    @Post()
    add_new_customer( @Request() req ): any {
        const payload = {'Email' : req.body.Email , 'Password' : req.body.Password, 'Name' : req.body.Name}
        //check if Value is Null
        for (const payloadKey of Object.keys(payload)) {
            if( payload[payloadKey] == null)
            {
                return null
            }
        }
        return this.customerservice.add_customer(payload)
    }
    
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    get_certain_customers(@Param('id') id, @Headers('Authorization') auth : string): any{
        const current_user = this.jwtUtil.decode(auth); // id , Role
        if(current_user._id != id){
            return "userId not match"
        }
    return this.customerservice.customer_data(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/favbars')
    get_favourite_bar(@Param('id') id, @Headers('Authorization') auth : string): any{
        const current_user = this.jwtUtil.decode(auth); // id , Role
        if(current_user._id != id){
            return "userId not match"
        }
    return this.customerservice.customer_favbars(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/favbars')
    add_favorite_bar(@Param('id') id, @Request() req, @Headers('Authorization') auth : string ): any{
        const current_user = this.jwtUtil.decode(auth); // id , Role
        if(current_user._id != id){
            return "userId not match"
        }
        if(req.body.barId == null){
            return null
        }
        this.barservice.bar_profile(req.body.barId)
        return this.customerservice.add_favbars(id, req.body.barId)
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':userID/favbars/:barID')
    remove_favorite_bar(@Param('userID') userId, @Param('barID') BarId, @Headers('Authorization') auth : string): any{
        const current_user = this.jwtUtil.decode(auth); // id , Role
        if(current_user._id != userId){
            return "userId not match"
        }
        return this.customerservice.remove_favbars(userId, BarId)        
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update_customer_data(@Param('id') id, @Request() req, @Headers('Authorization') auth : string): any{
        const current_user = this.jwtUtil.decode(auth); // id , Role
        if(current_user._id != id){
            return "userId not match"
        }
    return this.customerservice.edit_customer(id, req.body);
    }

    
}