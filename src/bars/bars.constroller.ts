import { Controller , Get , Param } from '@nestjs/common'
import { BarsService } from './bars.service'
@Controller('bars')
export class BarsController {

    constructor(private barservice: BarsService ) {}
    @Get()
    get_list_bars(): any {
        return this.barservice.list_bars();
    }

    @Get(':id')
    get_certain_bars(@Param('id') id): any{
        return this.barservice.bar_profile(id);
    }
    
}