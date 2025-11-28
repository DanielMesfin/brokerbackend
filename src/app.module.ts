import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { MarketingSalesModule } from './marketing-sales/marketing-sales.module';
import { ErpCrmModule } from './erp-crm/erp-crm.module';
import { SocialLinksModule } from './social-links/social-links.module';
import { AiAgentModule } from './ai-agent/ai-agent.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    forwardRef(() => AuthModule),
    UsersModule, 
    PostsModule,
    MarketingSalesModule,
    ErpCrmModule,
    SocialLinksModule,
    AiAgentModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}