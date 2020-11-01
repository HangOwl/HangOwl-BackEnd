import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BarsController } from './bars/bars.controller';
import { BarsModule } from './bars/bars.module';

import { CustomersController } from './customers/customers.controller';
import { CustomersModule } from './customers/customers.module';
import { ReservationsController } from './reservations/reservations.controller';
import { ReservationsModule} from './reservations/reservations.module';

import { MulterModule } from '@nestjs/platform-express';
import { AdminsController } from './admins/admins.controller'
import { AdminsModule } from './admins/admins.module';

import { MailerModule } from '@nestjs-modules/mailer';  
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { EmailService } from './email.service';

@Module({

  imports: [AuthModule, UsersModule , BarsModule, AdminsModule , ReservationsModule, CustomersModule,
    MongooseModule.forRoot('mongodb+srv://DrunkOrca:I4XfDlPwPXpBjjXO@cluster0.t25ry.gcp.mongodb.net/HangOwl?retryWrites=true&w=majority'), 
    MulterModule.register({
      dest: './files',
    }) , 

    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com' ,
        port: 465,
        secure: true, // upgrade later with STARTTLS
        auth: {
          user: "hangowls.2020@gmail.com",
          pass: "Hangowls_2020",
        },
      },
      defaults: {
        from:'"nest-modules" <noreply@gmail.com>',
      },
      template: {
        dir: 'templates',
        adapter: new EjsAdapter(), // or new PugAdapter()
        options: {
          strict: false,
        },
      },
    }),

    ],

  controllers: [AppController , BarsController , AdminsController, ReservationsController, CustomersController],
  providers: [AppService , EmailService ],
  
})
export class AppModule {}
