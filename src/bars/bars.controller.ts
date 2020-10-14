import { Controller , Get , Param, UseGuards , Headers, Post , Request, Put , Query , UseInterceptors , UploadedFile} from '@nestjs/common'
import { BarsService } from './bars.service'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JWTUtil } from 'src/auth/JWTUtil';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from './file-upload.utils';
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
        console.log("addbar");
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

    @Get(':id')
    get_certain_bar(@Param('id') id , @Query('search') search ): any{
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
        return this.barservice.edit_bar(current_user.userId ,payload)
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/pictures')
    @UseInterceptors(
      FileInterceptor('image', {
        storage: diskStorage({
          destination: 'uploads',
          filename: editFileName,
        }),
        fileFilter: imageFileFilter,
      }),
    )
    async uploadedFile(@UploadedFile() file , @Param('id') id , @Headers('Authorization') auth: string ) {
      const current_user = this.jwtUtil.decode(auth);
      if(current_user._id != id) return "Id bar and uploader id not matched"
      this.barservice.picture_add(file.filename)
      return file.filename
    }
}