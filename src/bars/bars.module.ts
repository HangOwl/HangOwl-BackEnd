import { Module } from '@nestjs/common';
import { BarsService } from './bars.service';
import { BarsRepository } from './bars.repository';

@Module({
  providers: [BarsService , BarsRepository],
  exports: [BarsService , BarsRepository ],
})
export class BarsModule {}