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
exports.Customer = void 0;
const swagger_1 = require("@nestjs/swagger");
class Customer {
}
exports.Customer = Customer;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier', example: '123e4567-e89b-12d3-a456-426614174000' }),
    __metadata("design:type", String)
], Customer.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Company name', example: 'Acme Inc.' }),
    __metadata("design:type", String)
], Customer.prototype, "companyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Contact person name', example: 'John Doe' }),
    __metadata("design:type", String)
], Customer.prototype, "contactPerson", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email address', example: 'contact@acme.com' }),
    __metadata("design:type", String)
], Customer.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Phone number', example: '+1234567890', required: false }),
    __metadata("design:type", String)
], Customer.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Billing address', required: false }),
    __metadata("design:type", String)
], Customer.prototype, "billingAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Shipping address', required: false }),
    __metadata("design:type", String)
], Customer.prototype, "shippingAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tax ID or VAT number', required: false }),
    __metadata("design:type", String)
], Customer.prototype, "taxId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment terms in days', example: 30, required: false }),
    __metadata("design:type", Number)
], Customer.prototype, "paymentTerms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date when the customer was created' }),
    __metadata("design:type", Date)
], Customer.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date when the customer was last updated' }),
    __metadata("design:type", Date)
], Customer.prototype, "updatedAt", void 0);
//# sourceMappingURL=customer.entity.js.map