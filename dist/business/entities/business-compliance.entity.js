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
exports.BusinessCompliance = exports.ComplianceRequirementStatus = exports.ComplianceStatus = void 0;
const typeorm_1 = require("typeorm");
const business_entity_1 = require("./business.entity");
var ComplianceStatus;
(function (ComplianceStatus) {
    ComplianceStatus["COMPLIANT"] = "compliant";
    ComplianceStatus["NON_COMPLIANT"] = "non_compliant";
    ComplianceStatus["AT_RISK"] = "at_risk";
    ComplianceStatus["SUSPENDED"] = "suspended";
})(ComplianceStatus || (exports.ComplianceStatus = ComplianceStatus = {}));
var ComplianceRequirementStatus;
(function (ComplianceRequirementStatus) {
    ComplianceRequirementStatus["PENDING"] = "pending";
    ComplianceRequirementStatus["VERIFIED"] = "verified";
    ComplianceRequirementStatus["EXPIRED"] = "expired";
    ComplianceRequirementStatus["WAIVED"] = "waived";
    ComplianceRequirementStatus["NOT_REQUIRED"] = "not_required";
})(ComplianceRequirementStatus || (exports.ComplianceRequirementStatus = ComplianceRequirementStatus = {}));
let BusinessCompliance = class BusinessCompliance {
    constructor() {
        this.suspensionReason = null;
        this.suspendedAt = null;
    }
    isCompliant() {
        return this.status === ComplianceStatus.COMPLIANT;
    }
    getExpiringRequirements(days = 30) {
        const now = new Date();
        const threshold = new Date(now);
        threshold.setDate(now.getDate() + days);
        return this.requirements.filter(req => {
            if (!req.dueDate)
                return false;
            const dueDate = new Date(req.dueDate);
            return dueDate <= threshold && dueDate >= now;
        });
    }
    getNonCompliantRequirements() {
        return this.requirements.filter(req => req.status === ComplianceRequirementStatus.EXPIRED ||
            (req.required && req.status !== ComplianceRequirementStatus.VERIFIED));
    }
    updateComplianceScore() {
        const totalRequirements = this.requirements.length;
        if (totalRequirements === 0) {
            this.complianceScore = 100;
            return;
        }
        const compliantCount = this.requirements.filter(req => req.status === ComplianceRequirementStatus.VERIFIED ||
            (!req.required && req.status !== ComplianceRequirementStatus.EXPIRED)).length;
        this.complianceScore = Math.round((compliantCount / totalRequirements) * 100);
        this.updateStatus();
    }
    updateStatus() {
        const nonCompliantReqs = this.getNonCompliantRequirements();
        if (nonCompliantReqs.length === 0) {
            this.status = ComplianceStatus.COMPLIANT;
            this.isSuspended = false;
            this.suspensionReason = null;
            this.suspendedAt = null;
        }
        else {
            this.status = ComplianceStatus.NON_COMPLIANT;
            const criticalIssues = nonCompliantReqs.some(req => ['business_license', 'tax_certificate'].includes(req.name.toLowerCase()));
            if (criticalIssues && !this.isSuspended) {
                this.isSuspended = true;
                this.suspensionReason = 'Critical compliance requirements missing or expired';
                this.suspendedAt = new Date();
            }
        }
    }
    addHistoryItem(action, performedBy, details = {}) {
        this.history = this.history || [];
        this.history.push({
            date: new Date(),
            action,
            performedBy,
            details,
        });
    }
};
exports.BusinessCompliance = BusinessCompliance;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BusinessCompliance.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], BusinessCompliance.prototype, "businessId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ComplianceStatus,
        default: ComplianceStatus.NON_COMPLIANT,
    }),
    __metadata("design:type", String)
], BusinessCompliance.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], BusinessCompliance.prototype, "complianceScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: [] }),
    __metadata("design:type", Array)
], BusinessCompliance.prototype, "requirements", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], BusinessCompliance.prototype, "settings", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: [] }),
    __metadata("design:type", Array)
], BusinessCompliance.prototype, "history", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], BusinessCompliance.prototype, "lastAudit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], BusinessCompliance.prototype, "nextAuditDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], BusinessCompliance.prototype, "isSuspended", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], BusinessCompliance.prototype, "suspensionReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], BusinessCompliance.prototype, "suspendedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], BusinessCompliance.prototype, "lastComplianceCheck", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], BusinessCompliance.prototype, "riskFactors", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => business_entity_1.Business, (business) => business.compliance, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'businessId' }),
    __metadata("design:type", business_entity_1.Business)
], BusinessCompliance.prototype, "business", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BusinessCompliance.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], BusinessCompliance.prototype, "updatedAt", void 0);
exports.BusinessCompliance = BusinessCompliance = __decorate([
    (0, typeorm_1.Entity)('business_compliances')
], BusinessCompliance);
//# sourceMappingURL=business-compliance.entity.js.map