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
exports.JwtPrismaGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const prisma_service_1 = require("../prisma/prisma.service");
let JwtPrismaGuard = class JwtPrismaGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(prisma) {
        super();
        this.prisma = prisma;
    }
    async canActivate(context) {
        var _a, _b, _c;
        const activate = (await super.canActivate(context));
        if (!activate)
            return false;
        const req = context.switchToHttp().getRequest();
        const jwtUser = req.user;
        if (!jwtUser || !jwtUser.userId)
            throw new common_1.UnauthorizedException();
        const user = await this.prisma.user.findUnique({ where: { id: jwtUser.userId } });
        if (!user)
            throw new common_1.UnauthorizedException();
        req.currentUser = { id: user.id, email: user.email, firstName: (_a = user.firstName) !== null && _a !== void 0 ? _a : null, secondName: (_b = user.secondName) !== null && _b !== void 0 ? _b : null, phone: (_c = user.phone) !== null && _c !== void 0 ? _c : null };
        return true;
    }
};
exports.JwtPrismaGuard = JwtPrismaGuard;
exports.JwtPrismaGuard = JwtPrismaGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JwtPrismaGuard);
//# sourceMappingURL=auth.guard.js.map