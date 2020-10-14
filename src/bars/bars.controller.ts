import { Controller , Get , Param, UseGuards , Headers, Post , Request, Put , Query , UseInterceptors , UploadedFile , Patch , Delete } from '@nestjs/common'
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
    get_list_bars( @Query('search') search ): any {
        if( search && search != "") {
            return this.barservice.bar_search(search); }
        else {
            return this.barservice.list_bars()
        }
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
    get_certain_bar(@Param('id') id ): any{
        return this.barservice.bar_profile(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch()
    edit_certain_bar(@Headers('Authorization') auth: string , @Request() req  ): any{
        const current_user = this.jwtUtil.decode(auth);
        return this.barservice.edit_bar(current_user.userId , req.body)
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/pictures')
    @UseInterceptors(
      FileInterceptor('image', {
        storage: diskStorage({
          destination: 'uploads',
          filename: editFileName,
        }),
        fileFilter: imageFileFilter,
      }),
    )
    async uploadedFile(@UploadedFile() file , @Param('id') id , @Headers('Authorization') auth: string , @Query('profile') profile ) {
      const current_user = this.jwtUtil.decode(auth);
      if(current_user._id != id) return "Id bar and uploader id not matched"
      if(profile == 'true') this.barservice.profile_picture_add(id , file.filename)
      else this.barservice.additonal_picture_add(id , file.filename)
      return file.filename
    }
    
    @UseGuards(JwtAuthGuard)
    @Delete(':id/pictures/:filename')
    async DeletePicture(@Param('id') id , @Headers('Authorization') auth: string , @Query('profile') profile , @Param('filename') filename) {
      const current_user = this.jwtUtil.decode(auth);
      if(current_user._id != id) return "Id bar and uploader id not matched"
      if(profile == 'true') this.barservice.profile_picture_add(id , '')
      else this.barservice.additonal_picture_remove(id , filename )
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/approve')
    async approve_bar(@Param('id') id , @Headers('Authorization') auth: string ) {
      const current_user = this.jwtUtil.decode(auth);
      if(current_user.Role != 2) return "You are not Adminnnn"
      else this.barservice.approve_bar(id)

    }
}