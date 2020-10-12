import { Module } from '@nestjs/common';
import { BarsService } from './bars.service';

@Module({
  providers: [BarsService ],
  exports: [BarsService  ],
})
export class BarsModule {}