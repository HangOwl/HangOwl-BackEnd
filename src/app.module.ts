import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BarsController } from './bars/bars.constroller';
import { BarsModule } from './bars/bars.module';
@Module({
  imports: [AuthModule, UsersModule , BarsModule ],
  controllers: [AppController , BarsController ],
  providers: [AppService],
})
export class AppModule {}
