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

@Module({
  imports: [AuthModule, UsersModule , BarsModule, CustomersModule, ReservationsModule ],
  controllers: [AppController , BarsController, CustomersController, ReservationsController ],
  providers: [AppService],
})
export class AppModule {}
