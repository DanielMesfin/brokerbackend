import { Module } from '@nestjs/common';
import { ErpCrmService } from './erp-crm.service';
import { ErpCrmController } from './erp-crm.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ErpCrmController],
  providers: [ErpCrmService],
  exports: [ErpCrmService],
})
export class ErpCrmModule {}
