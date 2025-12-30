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
exports.AuthController = exports.USER_ROLES = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const jwt_1 = require("@nestjs/jwt");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
exports.USER_ROLES = ['USER', 'ADMIN', 'SELLS_AGENT'];
class RegisterDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'user@example.com',
        description: 'User\'s email address. Must be unique across the platform.',
        required: true,
        format: 'email'
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'securePassword123!',
        description: 'User password. Must be at least 6 characters long.',
        required: true,
        minLength: 6,
        format: 'password'
    }),
    (0, class_validator_1.IsString)({ message: 'Password must be a string' }),
    (0, class_validator_1.MinLength)(6, { message: 'Password must be at least 6 characters long' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password is required' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'John',
        description: 'User\'s first name',
        required: true,
        maxLength: 50
    }),
    (0, class_validator_1.IsString)({ message: 'First name must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'First name is required' }),
    (0, class_validator_1.MaxLength)(50, { message: 'First name cannot be longer than 50 characters' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Doe',
        description: 'User\'s last name',
        required: true,
        maxLength: 50
    }),
    (0, class_validator_1.IsString)({ message: 'Last name must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Last name is required' }),
    (0, class_validator_1.MaxLength)(50, { message: 'Last name cannot be longer than 50 characters' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'USER',
        description: 'User role (USER, ADMIN, or MODERATOR)',
        enum: exports.USER_ROLES,
        default: 'USER'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Role must be a string' }),
    (0, class_validator_1.IsIn)(exports.USER_ROLES, { message: 'Invalid user role. Must be one of: ' + exports.USER_ROLES.join(', ') }),
    __metadata("design:type", String)
], RegisterDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '+1234567890',
        description: 'User\'s phone number in international format',
        required: false,
        maxLength: 20
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Phone number must be a string' }),
    (0, class_validator_1.Matches)(/^\+?[1-9]\d{1,14}$/, {
        message: 'Please provide a valid phone number in international format (e.g., +1234567890)'
    }),
    (0, class_validator_1.MaxLength)(20, { message: 'Phone number cannot be longer than 20 characters' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "phone", void 0);
class LoginDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user@example.com' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'securePassword123!' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
class AuthResponse {
}
class UserResponse {
}
let AuthController = class AuthController {
    constructor(authService, jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }
    async register(body) {
        const result = await this.authService.register(body.email, body.password, body.firstName, body.lastName, body.phone, body.role);
        return result;
    }
    async login(body) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const tokens = await this.authService.getTokens(user.id, user.email, user.role);
        await this.authService.updateRefreshToken(user.id, tokens.refreshToken);
        return {
            ...tokens,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName || '',
                lastName: user.secondName || '',
                phone: user.phone || '',
                role: user.role,
                isActive: user.isActive
            }
        };
    }
    async me(auth) {
        if (!auth) {
            throw new common_1.UnauthorizedException('No token provided');
        }
        const token = auth.replace(/^Bearer\s+/i, '');
        try {
            const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET || 'dev-secret' });
            const user = await this.authService.getPublicUserById(payload.sub);
            return { user };
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({
        summary: 'Register a new user',
        description: 'Registers a new user with the provided details. Email must be unique across the platform.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'User successfully registered',
        type: UserResponse,
        headers: {
            'Set-Cookie': {
                description: 'Sets an HTTP-only cookie with the authentication token',
                schema: { type: 'string' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - Invalid input data',
        content: {
            'application/json': {
                example: {
                    statusCode: 400,
                    message: [
                        'email must be an email',
                        'password must be longer than or equal to 6 characters'
                    ],
                    error: 'Bad Request'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Conflict - Email already exists',
        content: {
            'application/json': {
                example: {
                    statusCode: 409,
                    message: 'Email already in use',
                    error: 'Conflict'
                }
            }
        }
    }),
    (0, swagger_1.ApiBody)({
        type: RegisterDto,
        description: 'User registration details',
        required: true,
        examples: {
            minimal: {
                summary: 'Minimal registration',
                description: 'Email, password, first name and last name are required',
                value: {
                    email: 'user@example.com',
                    password: 'SecurePass123!',
                    firstName: 'John',
                    lastName: 'Doe'
                }
            },
            full: {
                summary: 'Full registration',
                description: 'All available fields including optional ones',
                value: {
                    email: 'user@example.com',
                    password: 'SecurePass123!',
                    firstName: 'John',
                    lastName: 'Doe',
                    phone: '+1234567890',
                    role: 'USER'
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
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User successfully logged in', type: AuthResponse }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials' }),
    (0, swagger_1.ApiBody)({ type: LoginDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns current user data' }),
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
    __param(0, (0, common_1.Inject)('AUTH_SERVICE')),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        jwt_1.JwtService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map