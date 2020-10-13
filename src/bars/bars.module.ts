import { Module } from '@nestjs/common';
import { BarsService } from './bars.service';
import { MongooseModule } from '@nestjs/mongoose'
import { UserSchema } from 'src/users/users.model'
@Module({
  imports: [MongooseModule.forFeature([{name: 'User', schema: UserSchema}])],
  providers: [BarsService ],
  exports: [BarsService  ],
})
export class BarsModule {}