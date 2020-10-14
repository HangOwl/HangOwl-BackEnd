import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { MongooseModule } from '@nestjs/mongoose'
import { UserSchema } from 'src/users/users.model'
@Module({
  imports: [MongooseModule.forFeature([{name: 'User', schema: UserSchema}])],
  providers: [AdminsService ],
  exports: [AdminsService  ],
})
export class AdminsModule {}