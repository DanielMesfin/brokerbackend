"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const oauth2_controller_1 = require("./oauth2.controller");
const jwt_strategy_1 = require("./jwt.strategy");
const google_oauth2_strategy_1 = require("./strategies/google-oauth2.strategy");
const prisma_module_1 = require("../prisma/prisma.module");
const auth_guard_1 = require("./auth.guard");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => prisma_module_1.PrismaModule),
            config_1.ConfigModule,
            passport_1.PassportModule.register({ defaultStrategy: ['jwt', 'google', 'facebook'] }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET') || 'dev-secret',
                    signOptions: { expiresIn: '7d' },
                }),
            }),
        ],
        providers: [
            {
                provide: 'AUTH_SERVICE',
                useClass: auth_service_1.AuthService,
            },
            auth_service_1.AuthService,
            jwt_strategy_1.JwtStrategy,
            google_oauth2_strategy_1.GoogleOAuth2Strategy,
            auth_guard_1.JwtPrismaGuard,
            jwt_auth_guard_1.JwtAuthGuard
        ],
        controllers: [auth_controller_1.AuthController, oauth2_controller_1.OAuth2Controller],
        exports: ['AUTH_SERVICE', jwt_auth_guard_1.JwtAuthGuard]
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map