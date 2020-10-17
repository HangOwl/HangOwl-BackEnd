import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { MongooseModule } from '@nestjs/mongoose'
import { UserSchema } from 'src/users/users.model'
import { CustomerMapper } from './customers.mapper';
import { UsersService } from 'src/users/users.service';



@Module({
  imports: [MongooseModule.forFeature([{name: 'User', schema: UserSchema}]) , UsersService ],
  providers: [CustomersService , CustomerMapper ],
  exports: [CustomersService  , CustomerMapper ],
})

export class CustomersModule {}