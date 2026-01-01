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
exports.Promotion = exports.PromotionStatus = exports.PromotionType = void 0;
const typeorm_1 = require("typeorm");
const business_entity_1 = require("./business.entity");
var PromotionType;
(function (PromotionType) {
    PromotionType["PERCENTAGE"] = "PERCENTAGE";
    PromotionType["FIXED_AMOUNT"] = "FIXED_AMOUNT";
    PromotionType["BUY_ONE_GET_ONE"] = "BUY_ONE_GET_ONE";
    PromotionType["FREE_SHIPPING"] = "FREE_SHIPPING";
})(PromotionType || (exports.PromotionType = PromotionType = {}));
var PromotionStatus;
(function (PromotionStatus) {
    PromotionStatus["DRAFT"] = "DRAFT";
    PromotionStatus["ACTIVE"] = "ACTIVE";
    PromotionStatus["PAUSED"] = "PAUSED";
    PromotionStatus["EXPIRED"] = "EXPIRED";
    PromotionStatus["SCHEDULED"] = "SCHEDULED";
})(PromotionStatus || (exports.PromotionStatus = PromotionStatus = {}));
let Promotion = class Promotion {
    isValid() {
        const now = new Date();
        return (this.isActive &&
            this.status === PromotionStatus.ACTIVE &&
            this.startDate <= now &&
            this.endDate >= now &&
            (this.maxUses === 0 || this.usageCount < this.maxUses));
    }
    applyDiscount(amount) {
        if (!this.isValid() || amount < this.minOrderAmount) {
            return amount;
        }
        let discount = 0;
        switch (this.type) {
            case PromotionType.PERCENTAGE:
                discount = (amount * this.value) / 100;
                if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
                    discount = this.maxDiscountAmount;
                }
                break;
            case PromotionType.FIXED_AMOUNT:
                discount = Math.min(this.value, amount);
                break;
            case PromotionType.FREE_SHIPPING:
                break;
            case PromotionType.BUY_ONE_GET_ONE:
                break;
        }
        return Math.max(0, amount - discount);
    }
};
exports.Promotion = Promotion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Promotion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Promotion.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Promotion.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PromotionType,
    }),
    __metadata("design:type", String)
], Promotion.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Promotion.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Promotion.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp with time zone'),
    __metadata("design:type", Date)
], Promotion.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp with time zone'),
    __metadata("design:type", Date)
], Promotion.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Promotion.prototype, "usageCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Promotion.prototype, "maxUses", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], Promotion.prototype, "maxDiscountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Promotion.prototype, "minOrderAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PromotionStatus,
        default: PromotionStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Promotion.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Promotion.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], Promotion.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Promotion.prototype, "businessId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => business_entity_1.Business, business => business.promotions, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'businessId' }),
    __metadata("design:type", Object)
], Promotion.prototype, "business", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Promotion.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Promotion.prototype, "updatedAt", void 0);
exports.Promotion = Promotion = __decorate([
    (0, typeorm_1.Entity)('promotions')
], Promotion);
//# sourceMappingURL=promotion.entity.js.map