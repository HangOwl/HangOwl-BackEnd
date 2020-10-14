import { Controller , Get , Param, UseGuards , Headers, Post , Request, Put , Query , UseInterceptors , UploadedFile , Patch , Delete } from '@nestjs/common'
import { AdminsService } from './admins.service'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
@Controller('admins')
export class AdminsController {
    constructor(private adminservice: AdminsService ,) {}
    @Post()
    add_ADMIN( @Request() req ): any {

        //return this.barservice.add_bar();
        const payload = { 'Email' : req.body.Email , 'Password' : req.body.Password  , 'Username' : req.body.Username }
        return this.adminservice.add_admin(payload)
    }

}