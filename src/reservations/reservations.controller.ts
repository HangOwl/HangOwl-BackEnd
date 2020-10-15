import { Controller , Get, Param, Post, Request, UseGuards, Headers, Delete, Patch} from '@nestjs/common'
import { ReservationsService } from './reservations.service'
import { JWTUtil } from 'src/auth/JWTUtil';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BarsService } from 'src/bars/bars.service';

@Controller('reservations')
export class ReservationsController {

    constructor(private readonly reservationservice: ReservationsService,
                private readonly jwtUtil: JWTUtil,
                private readonly barservice: BarsService ) {}
    
    @UseGuards(JwtAuthGuard)         
    @Post()
    add_Reserve( @Request() req, @Headers('Authorization') auth : string ): any {
        const current_user = this.jwtUtil.decode(auth); // id , Role
        const payload = { 'cusId' : current_user._id ,'barId' : req.body.barId ,'DateReserve' : req.body.DateReserve,
                          'NumberofPeople' : req.body.NumberofPeople , 'Postscript' : req.body.Postscript}
        console.log(payload)
        //check BarId
        this.barservice.bar_profile(req.body.BarId)
        //check if Value is Null
        for (const payloadKey of Object.keys(payload)) {
            if( payload[payloadKey] == null && payloadKey!="Postscript")
            {
                return null
            }
        }
        return this.reservationservice.add_reserve(payload)
    }

}
