import { Module } from '@nestjs/common';
import { BarsService } from './bars.service';
import { MongooseModule } from '@nestjs/mongoose'
import { BarSchema } from './bars.model'
@Module({
  imports: [MongooseModule.forFeature([{name: 'Bar', schema: BarSchema}])],
  providers: [BarsService ],
  exports: [BarsService  ],
})
export class BarsModule {}