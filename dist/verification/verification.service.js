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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationService = exports.VerificationType = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
var VerificationType;
(function (VerificationType) {
    VerificationType["EMAIL"] = "EMAIL";
    VerificationType["PHONE"] = "PHONE";
})(VerificationType || (exports.VerificationType = VerificationType = {}));
let VerificationService = class VerificationService {
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
    }
    async findUserByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
    async generateVerificationCode(userId, type) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        await this.prisma.verificationCode.upsert({
            where: { userId_type: { userId, type } },
            update: { code, expiresAt, isUsed: false },
            create: {
                userId,
                code,
                type,
                expiresAt,
            },
        });
        return code;
    }
    async sendVerificationEmail(email, code) {
        await this.mailService.sendVerificationEmail(email, code);
    }
    async verifyCode(userId, code, type) {
        const verification = await this.prisma.verificationCode.findFirst({
            where: {
                userId,
                code,
                type,
                isUsed: false,
                expiresAt: { gt: new Date() },
            },
        });
        if (!verification) {
            return false;
        }
        await this.prisma.verificationCode.update({
            where: { id: verification.id },
            data: { isUsed: true },
        });
        if (type === VerificationType.EMAIL) {
            await this.prisma.userProfile.update({
                where: { userId },
                data: { isVerified: true },
            });
        }
        return true;
    }
};
exports.VerificationService = VerificationService;
exports.VerificationService = VerificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], VerificationService);
//# sourceMappingURL=verification.service.js.map