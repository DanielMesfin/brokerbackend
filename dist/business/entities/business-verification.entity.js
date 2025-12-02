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
exports.BusinessVerification = exports.VerificationMethod = exports.VerificationStatus = void 0;
const typeorm_1 = require("typeorm");
const business_entity_1 = require("./business.entity");
var VerificationStatus;
(function (VerificationStatus) {
    VerificationStatus["PENDING"] = "pending";
    VerificationStatus["IN_REVIEW"] = "in_review";
    VerificationStatus["VERIFIED"] = "verified";
    VerificationStatus["REJECTED"] = "rejected";
    VerificationStatus["SUSPENDED"] = "suspended";
})(VerificationStatus || (exports.VerificationStatus = VerificationStatus = {}));
var VerificationMethod;
(function (VerificationMethod) {
    VerificationMethod["MANUAL"] = "manual";
    VerificationMethod["AUTOMATED"] = "automated";
    VerificationMethod["THIRD_PARTY"] = "third_party";
})(VerificationMethod || (exports.VerificationMethod = VerificationMethod = {}));
let BusinessVerification = class BusinessVerification {
    isVerified() {
        return this.status === VerificationStatus.VERIFIED;
    }
    needsReview() {
        return [VerificationStatus.PENDING, VerificationStatus.IN_REVIEW].includes(this.status);
    }
};
exports.BusinessVerification = BusinessVerification;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BusinessVerification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], BusinessVerification.prototype, "businessId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: VerificationStatus,
        default: VerificationStatus.PENDING,
    }),
    __metadata("design:type", String)
], BusinessVerification.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: VerificationMethod,
        nullable: true,
    }),
    __metadata("design:type", String)
], BusinessVerification.prototype, "verificationMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], BusinessVerification.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], BusinessVerification.prototype, "verificationData", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], BusinessVerification.prototype, "verifiedById", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], BusinessVerification.prototype, "verifiedByName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], BusinessVerification.prototype, "verifiedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], BusinessVerification.prototype, "isAutoVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], BusinessVerification.prototype, "riskAssessment", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => business_entity_1.Business, (business) => business.verification, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'businessId' }),
    __metadata("design:type", business_entity_1.Business)
], BusinessVerification.prototype, "business", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BusinessVerification.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], BusinessVerification.prototype, "updatedAt", void 0);
exports.BusinessVerification = BusinessVerification = __decorate([
    (0, typeorm_1.Entity)('business_verifications')
], BusinessVerification);
//# sourceMappingURL=business-verification.entity.js.map