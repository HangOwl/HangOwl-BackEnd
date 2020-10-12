import { Controller , Get , Param } from '@nestjs/common'
import { BarsRepository } from './bars.repository'
@Controller('bars')
export class BarsController {

    constructor(private barsrepository: BarsRepository ) {}
    @Get()
    get_list_bars(): any {
        return this.barsrepository.list_bars();
    }

    @Get(':id')
    get_certain_bars(@Param('id') id): any{
        return this.barsrepository.bar_profile(id);
    }
    
}