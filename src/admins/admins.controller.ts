import { Controller , Get , Param, UseGuards , Headers, Post , Request, Put , Query , UseInterceptors , UploadedFile , Patch , Delete } from '@nestjs/common'
import { AdminsService } from './admins.service'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JWTUtil } from 'src/auth/JWTUtil';
@Controller('admins')
export class AdminsController {
    constructor(private adminservice: AdminsService , private readonly jwtUtil: JWTUtil ) {}
    //@UseGuards(JwtAuthGuard)
    @Post()
    async add_ADMIN( @Request() req , @Headers('Authorization') auth ) {

        //return this.barservice.add_bar();
        //const current_user = this.jwtUtil.decode(auth);
        //if(current_user.Role != 2) return "You are not admin"
        const payload = { 'Email' : req.body.Email , 'Password' : req.body.Password  , 'AdminName' : req.body.Name } 
        return this.adminservice.add_admin(payload)
    }

}
