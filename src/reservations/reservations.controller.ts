import { Controller , Get, Param, Post, Request, UseGuards, Headers, Delete, Patch, Query} from '@nestjs/common'
import { ReservationsService } from './reservations.service'
import { JWTUtil } from 'src/auth/JWTUtil';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BarsService } from 'src/bars/bars.service';
import { ReservationsMapper } from './reservations.mapper'
@Controller('reservations')
export class ReservationsController {

    constructor(private readonly reservationservice: ReservationsService,
                private readonly jwtUtil: JWTUtil,
                private readonly barservice: BarsService ,
                private readonly reservationmapper: ReservationsMapper) {}
    
    @UseGuards(JwtAuthGuard)         
    @Post()
    add_Reserve( @Request() req, @Headers('Authorization') auth : string ): any {
        const current_user = this.jwtUtil.decode(auth); // id , Role
        if(current_user.Role != 0){
            return "You are not customer"
        }
        const payload = { 'CustomerId' : current_user._id ,'BarId' : req.body.barId ,'DateReserve' : req.body.DateReserve,
                          'NumberOfPeople' : req.body.NumberOfPeople , 'PostScript' : req.body.Postscript}
        //check if Value is Null
        for (const payloadKey of Object.keys(payload)) {
            if( payload[payloadKey] == null)
            {
                return payloadKey.concat(' ' , 'can not be null.')
            }
        }
        const date_regex =  /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/
        if ( ! date_regex.test(req.body.DateReserve) ) {
            return 'date format invalid.'
        }
        return this.reservationservice.add_reserve(payload)
    }

    @UseGuards(JwtAuthGuard)         
    @Get()
    async get_reservations_data(@Headers('Authorization') auth : string)   {
        const current_user = this.jwtUtil.decode(auth); // id , Role
        console.log(current_user)
        if(current_user.Role == 0){
            return this.reservationmapper.object_view( await this.reservationservice.cus_reserve_list(current_user._id) )
        }
        if(current_user.Role == 1){
            return this.reservationmapper.object_view( await this.reservationservice.bar_reserve_list(current_user._id)  )
        }
    }

    @UseGuards(JwtAuthGuard)         
    @Delete(':resId')
    delete_Reserve(@Param('resId') resId, @Headers('Authorization') auth : string): any{
        const current_user = this.jwtUtil.decode(auth); // id , Role
        /*
        if(current_user.Role != 0){
            return "You are not customer"
        }
        */   
        return this.reservationservice.delete_reserve(resId,current_user._id)       
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':resId')
    edit_Reserve(@Param('resId') resId, @Request() req, @Headers('Authorization') auth : string): any{
        const current_user = this.jwtUtil.decode(auth); // id , Role
        /*
        if(current_user.Role != 0){
            return "You are not customer"
        }
        */
    return this.reservationservice.edit_reserve(resId, current_user._id, req.body)
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':resId/approve')
    approve_Reserve(@Param('resId') resId, @Headers('Authorization') auth : string): any{
        const current_user = this.jwtUtil.decode(auth); // id , Role
        return this.reservationservice.approve_reserve(resId,current_user._id)       
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':resId/reject')
    reject_Reserve(@Param('resId') resId, @Headers('Authorization') auth : string): any{
        const current_user = this.jwtUtil.decode(auth); // id , Role
        return this.reservationservice.reject_reserve(resId,current_user._id)       
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    delete_all_day(@Request() req , @Headers('Authorization') auth : string): any {
        const current_user = this.jwtUtil.decode(auth); // id , Role
        if ( req.body.date == null ) {
            return 'date cannot be null.'
        }
        const date_regex =  /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/
        if ( ! date_regex.test(req.body.date) ) {
            return 'date format invalid.'
        }
        const date = req.body.date.concat('' , 'T00:00:00.000Z')
        return this.reservationservice.delete_all_res(current_user._id,date)
    }
}

