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
exports.Business = exports.BusinessStatus = exports.BusinessType = void 0;
const typeorm_1 = require("typeorm");
const business_document_entity_1 = require("./business-document.entity");
const business_verification_entity_1 = require("./business-verification.entity");
const business_compliance_entity_1 = require("./business-compliance.entity");
var BusinessType;
(function (BusinessType) {
    BusinessType["SOLE_PROPRIETORSHIP"] = "sole_proprietorship";
    BusinessType["PARTNERSHIP"] = "partnership";
    BusinessType["LLC"] = "llc";
    BusinessType["CORPORATION"] = "corporation";
    BusinessType["NON_PROFIT"] = "non_profit";
    BusinessType["OTHER"] = "other";
})(BusinessType || (exports.BusinessType = BusinessType = {}));
var BusinessStatus;
(function (BusinessStatus) {
    BusinessStatus["DRAFT"] = "draft";
    BusinessStatus["PENDING_VERIFICATION"] = "pending_verification";
    BusinessStatus["VERIFIED"] = "verified";
    BusinessStatus["REJECTED"] = "rejected";
    BusinessStatus["SUSPENDED"] = "suspended";
})(BusinessStatus || (exports.BusinessStatus = BusinessStatus = {}));
let Business = class Business {
};
exports.Business = Business;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Business.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Business.prototype, "legalName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Business.prototype, "tradeName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: BusinessType,
        default: BusinessType.OTHER,
    }),
    __metadata("design:type", String)
], Business.prototype, "businessType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Business.prototype, "industry", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Business.prototype, "registrationNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Business.prototype, "taxIdentificationNumber", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Business.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Business.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Business.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Business.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Business.prototype, "postalCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Business.prototype, "establishmentDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Business.prototype, "ownerName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Business.prototype, "ownerEmail", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Business.prototype, "ownerPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Business.prototype, "website", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: BusinessStatus,
        default: BusinessStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Business.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Business.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => business_document_entity_1.BusinessDocument, (document) => document.business, { cascade: true }),
    __metadata("design:type", Array)
], Business.prototype, "documents", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => business_verification_entity_1.BusinessVerification, { cascade: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", business_verification_entity_1.BusinessVerification)
], Business.prototype, "verification", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => business_compliance_entity_1.BusinessCompliance, { cascade: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", business_compliance_entity_1.BusinessCompliance)
], Business.prototype, "compliance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Business.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Business.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Business.prototype, "suspensionReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Business.prototype, "suspendedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Business.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Business.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Business.prototype, "isDeleted", void 0);
exports.Business = Business = __decorate([
    (0, typeorm_1.Entity)('businesses')
], Business);
//# sourceMappingURL=business.entity.js.map