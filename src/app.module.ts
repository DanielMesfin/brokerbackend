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

/**
 * Root application module that imports all feature modules.
 * PrismaModule is imported here to make PrismaService available throughout the application.
 * ConfigModule is set as global to provide configuration throughout the app.
 */
@Module({
  imports: [
    // Global configuration module (loads .env file)
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: '.env',
      expandVariables: true,
    }),
    
    // PrismaModule is marked as @Global() so it's available everywhere
    PrismaModule,
    
    // Feature modules with circular dependencies handled by forwardRef
    forwardRef(() => AuthModule),
    
    // Application feature modules
    UsersModule,
    PostsModule,
    MarketingSalesModule,
    ErpCrmModule,
    SocialLinksModule,
    AiAgentModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}