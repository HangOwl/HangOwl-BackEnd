import { Controller , Get , Param, UseGuards , Headers, Post , Request, Put } from '@nestjs/common'
import { BarsService } from './bars.service'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JWTUtil } from 'src/auth/JWTUtil';
import { type } from 'os';
@Controller('bars')
export class BarsController {

    constructor(private barservice: BarsService ,
                private readonly jwtUtil: JWTUtil , ) {}
    @Get()
    get_list_bars(): any {
        return this.barservice.list_bars();
    }
    
    @Post()
    add_BAR( @Request() req ): any {
        //return this.barservice.add_bar();
        const payload = { 'Email' : req.body.Email , 'Password' : req.body.Password ,
                          'BarName' : req.body.BarName , 'LineID' : req.body.LineID , 'OpenTime' : req.body.OpenTime , 
                          'CloseTime' : req.body.CloseTime , 'CloseWeekDay' : req.body.CloseWeekDay , 'Address' : req.body.Address ,
                          'BarDescription' : req.body.BarDescription , 'BarRule' : req.body.BarRule }
        //check if Value is Null
        for (const payloadKey of Object.keys(payload)) {
            if( payload[payloadKey] == null)
            {
                return null
            }
        }
        return this.barservice.add_bar(payload)
    }
    @UseGuards(JwtAuthGuard)

    @Get('decode')
    decode_it(@Headers('Authorization') auth: string): any {
        const json = this.jwtUtil.decode(auth);
        return json
      }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    get_certain_bar(@Param('id') id): any{
        return this.barservice.bar_profile(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put()
    edit_certain_bar(@Headers('Authorization') auth: string , @Request() req  ): any{
        const current_user = this.jwtUtil.decode(auth);
        //return this.barservice.add_bar();
        const payload = { 'Email' : req.body.Email , 'Password' : req.body.Password ,
                          'BarName' : req.body.BarName , 'LineID' : req.body.LineID , 'OpenTime' : req.body.OpenTime , 
                          'CloseTime' : req.body.CloseTime , 'CloseWeekDay' : req.body.CloseWeekDay , 'Address' : req.body.Address ,
                          'BarDescription' : req.body.BarDescription , 'BarRule' : req.body.BarRule }
        //check if Value is Null
        for (const payloadKey of Object.keys(payload)) {
            if( payload[payloadKey] == null)
            {
                return null
            }
        }
        return this.barservice.edit_bar(payload)
    }
    
}