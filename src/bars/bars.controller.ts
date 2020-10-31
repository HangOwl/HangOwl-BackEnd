import { Controller , Get , Param, UseGuards , Headers, Post , Request, Put , Query , UseInterceptors , UploadedFile , Patch , Delete } from '@nestjs/common'
import { BarsService } from './bars.service'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JWTUtil } from 'src/auth/JWTUtil';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from './file-upload.utils';
import { type } from 'os';
import { BarMapper } from './bars.mapper';
@Controller('bars')
export class BarsController {

    constructor(private barservice: BarsService ,
                private readonly jwtUtil: JWTUtil , 
                private barmapper: BarMapper ) {}
    @Get()
    async get_list_bars( @Query('search') search ) {
        if( search && search != "") {
            return this.barmapper.object_customerview(await this.barservice.bar_search(search)); 
        }
        else {
            return this.barmapper.object_customerview(await this.barservice.list_bars()); 
        }
    } 
    @Get('unverified_bar')
    //@UseGuards(JwtAuthGuard)
    async get_list_unapprove_bars( @Headers('Authorization') auth ) {
      //const current_user = this.jwtUtil.decode(auth);
      //if(current_user.Role != 2) return "You are not Admin"
      return this.barmapper.object_barview(await this.barservice.list_unapprove_bars()); 
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
            if( payload[payloadKey] == null || payload[payloadKey] == '' )
            {
                return payloadKey.concat(' ' , 'can not be null.')
            }
        }
        return this.barservice.add_bar(payload)
    }

    @Get(':id')
    async get_certain_bar(@Param('id') id ) {
        return  this.barmapper.customerview(await this.barservice.bar_profile(id) ); 
    }
    
    @UseGuards(JwtAuthGuard)
    @Get(':id/profile')
    async get_certain_bar_profile(@Param('id') id , @Headers('Authorization') auth: string ) {
      const current_user = this.jwtUtil.decode(auth);
      if( current_user._id  != id ) return "Bar id and viewer id not matched"
      else return  this.barmapper.barview(await this.barservice.bar_profile(id) ); 
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async edit_certain_bar(@Headers('Authorization') auth: string , @Request() req  , @Param('id') id ) {
        const current_user = this.jwtUtil.decode(auth);
        if( current_user._id  != id ) return "Bar id and editor id not matched"
        return  await this.barservice.edit_bar(current_user._id , req.body) 
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
      if(current_user._id != id) return "Bar id and uploader id not matched"
      if(profile == 'true') this.barservice.profile_picture_add(id , file.filename)
      else this.barservice.additonal_picture_add(id , file.filename)
      return file.filename
    }
    
    @UseGuards(JwtAuthGuard)
    @Delete(':id/pictures/:filename')
    async DeletePicture(@Param('id') id , @Headers('Authorization') auth: string , @Query('profile') profile , @Param('filename') filename) {
      const current_user = this.jwtUtil.decode(auth);
      if(current_user._id != id) return "Bar id and deleter id not matched"
      if(profile == 'true') 
      { 
        this.barservice.profile_picture_add(id , '') 
        return 'Delete success.'
      }
      else return this.barservice.additonal_picture_remove(id , filename )
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/approve')
    async approve_bar(@Param('id') id , @Headers('Authorization') auth: string ) {
      const current_user = this.jwtUtil.decode(auth);
      if(current_user.Role != 2) return "You are not Admin"
      else this.barservice.approve_bar(id)

    }
}