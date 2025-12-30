import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OAuth2Controller } from './oauth2.controller';
import { JwtStrategy } from './jwt.strategy';
import { GoogleOAuth2Strategy } from './strategies/google-oauth2.strategy';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtPrismaGuard } from './auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    forwardRef(() => PrismaModule),
    ConfigModule,
    PassportModule.register({ defaultStrategy: ['jwt', 'google', 'facebook'] }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'dev-secret',
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  providers: [
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
    AuthService,
    JwtStrategy,
    GoogleOAuth2Strategy,
    JwtPrismaGuard,
    JwtAuthGuard
  ],
  controllers: [AuthController, OAuth2Controller],
  exports: ['AUTH_SERVICE', JwtAuthGuard]
})
export class AuthModule {}
