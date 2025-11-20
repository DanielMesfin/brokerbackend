"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const jwt_1 = require("@nestjs/jwt");
const swagger_1 = require("@nestjs/swagger");
class RegisterDto {
}
class LoginDto {
}
class AuthResponse {
}
class UserResponse {
}
let AuthController = class AuthController {
    constructor(auth, jwtService) {
        this.auth = auth;
        this.jwtService = jwtService;
    }
    async register(body) {
        const user = await this.auth.register(body.email, body.password, body.displayName);
        return { id: user.id, email: user.email, displayName: user.displayName };
    }
    async login(body) {
        const user = await this.auth.validateUser(body.email, body.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.auth.login(user);
    }
    async me(auth) {
        if (!auth) {
            throw new common_1.UnauthorizedException('No token provided');
        }
        const token = auth.replace(/^Bearer\s+/i, '');
        try {
            const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET || 'dev-secret' });
            return { user: { id: payload.sub, email: payload.email } };
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User successfully registered', type: UserResponse }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Invalid input' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Conflict - Email already exists' }),
    (0, swagger_1.ApiBody)({
        type: RegisterDto,
        examples: {
            user: {
                summary: 'User Registration',
                value: {
                    email: 'user@example.com',
                    password: 'securePassword123!',
                    displayName: 'John Doe'
                }
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'User login' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Login successful', type: AuthResponse }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - Invalid credentials' }),
    (0, swagger_1.ApiBody)({
        type: LoginDto,
        examples: {
            user: {
                summary: 'User Login',
                value: {
                    email: 'user@example.com',
                    password: 'securePassword123!'
                }
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns current user data', type: UserResponse }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - Invalid or missing token' }),
    (0, swagger_1.ApiHeader)({
        name: 'Authorization',
        description: 'JWT token',
        required: true,
        example: 'Bearer your-jwt-token-here'
    }),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('api/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService, jwt_1.JwtService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map