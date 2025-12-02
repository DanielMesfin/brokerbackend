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
exports.BusinessDocument = exports.DocumentStatus = exports.DocumentType = void 0;
const typeorm_1 = require("typeorm");
const business_entity_1 = require("./business.entity");
var DocumentType;
(function (DocumentType) {
    DocumentType["BUSINESS_LICENSE"] = "business_license";
    DocumentType["TAX_CERTIFICATE"] = "tax_certificate";
    DocumentType["OWNER_ID"] = "owner_id";
    DocumentType["BANK_ACCOUNT"] = "bank_account";
    DocumentType["INDUSTRY_SPECIFIC"] = "industry_specific";
    DocumentType["OTHER"] = "other";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
var DocumentStatus;
(function (DocumentStatus) {
    DocumentStatus["PENDING"] = "pending";
    DocumentStatus["APPROVED"] = "approved";
    DocumentStatus["REJECTED"] = "rejected";
    DocumentStatus["EXPIRED"] = "expired";
})(DocumentStatus || (exports.DocumentStatus = DocumentStatus = {}));
let BusinessDocument = class BusinessDocument {
};
exports.BusinessDocument = BusinessDocument;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BusinessDocument.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BusinessDocument.prototype, "businessId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: DocumentType,
        default: DocumentType.OTHER,
    }),
    __metadata("design:type", String)
], BusinessDocument.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BusinessDocument.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BusinessDocument.prototype, "fileUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], BusinessDocument.prototype, "fileType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], BusinessDocument.prototype, "fileSize", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], BusinessDocument.prototype, "issueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], BusinessDocument.prototype, "expiryDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: DocumentStatus,
        default: DocumentStatus.PENDING,
    }),
    __metadata("design:type", String)
], BusinessDocument.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], BusinessDocument.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], BusinessDocument.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], BusinessDocument.prototype, "uploadedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], BusinessDocument.prototype, "verifiedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], BusinessDocument.prototype, "verifiedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], BusinessDocument.prototype, "uploadedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => business_entity_1.Business, (business) => business.documents, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'businessId' }),
    __metadata("design:type", business_entity_1.Business)
], BusinessDocument.prototype, "business", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BusinessDocument.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], BusinessDocument.prototype, "updatedAt", void 0);
exports.BusinessDocument = BusinessDocument = __decorate([
    (0, typeorm_1.Entity)('business_documents')
], BusinessDocument);
//# sourceMappingURL=business-document.entity.js.map