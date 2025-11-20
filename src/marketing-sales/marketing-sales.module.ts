import { Module } from '@nestjs/common';
import { MarketingSalesService } from './marketing-sales.service';
import { MarketingSalesController } from './marketing-sales.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MarketingSalesController],
  providers: [MarketingSalesService],
  exports: [MarketingSalesService],
})
export class MarketingSalesModule {}
