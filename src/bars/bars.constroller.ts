import { Controller , Get , Param, UseGuards , Headers} from '@nestjs/common'
import { BarsService } from './bars.service'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JWTUtil } from 'src/auth/JWTUtil';
@Controller('bars')
export class BarsController {

    constructor(private barservice: BarsService ,
                private readonly jwtUtil: JWTUtil , ) {}
    @Get()
    get_list_bars(): any {
        return this.barservice.list_bars();
    }
    
    @UseGuards(JwtAuthGuard)

    @Get('decode')
    decode_it(@Headers('Authorization') auth: string): any {
        const json = this.jwtUtil.decode(auth);
        return json
      }

    @Get(':id')
    get_certain_bars(@Param('id') id): any{
        return this.barservice.bar_profile(id);
    }


    
}