import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BarsController } from './bars/bars.controller';
import { BarsModule } from './bars/bars.module';
import { MulterModule } from '@nestjs/platform-express';
@Module({
  imports: [AuthModule, UsersModule , BarsModule,
    MongooseModule.forRoot('mongodb+srv://DrunkOrca:I4XfDlPwPXpBjjXO@cluster0.t25ry.gcp.mongodb.net/HangOwl?retryWrites=true&w=majority'), 
    MulterModule.register({
      dest: './files',
    }) ],
  controllers: [AppController , BarsController ],
  providers: [AppService],
  
})
export class AppModule {}
