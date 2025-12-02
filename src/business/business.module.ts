import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Business } from './entities/business.entity';
import { BusinessDocument } from './entities/business-document.entity';
import { BusinessVerification } from './entities/business-verification.entity';
import { BusinessCompliance } from './entities/business-compliance.entity';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Business,
      BusinessDocument,
      BusinessVerification,
      BusinessCompliance,
    ]),
    ConfigModule,
    AuthModule,
  ],
  controllers: [BusinessController],
  providers: [BusinessService],
  exports: [BusinessService],
})
export class BusinessModule {}
