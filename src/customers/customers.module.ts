import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { MongooseModule } from '@nestjs/mongoose'
import { UserSchema } from 'src/users/users.model'
import { CustomerMapper } from './customers.mapper';
import { EmailService } from 'src/email.service';
import { AppModule } from 'src/app.module';



@Module({
  imports: [MongooseModule.forFeature([{name: 'User', schema: UserSchema}])  ],
  providers: [CustomersService , CustomerMapper ,EmailService ],
  exports: [CustomersService  , CustomerMapper ],
})

export class CustomersModule {}