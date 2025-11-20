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
exports.Listing = void 0;
const swagger_1 = require("@nestjs/swagger");
class Listing {
    constructor(partial) {
        Object.assign(this, partial);
    }
    getTags() {
        try {
            return this.tags ? JSON.parse(this.tags) : [];
        }
        catch (e) {
            return [];
        }
    }
    getImageUrls() {
        try {
            return this.imageUrls ? JSON.parse(this.imageUrls) : [];
        }
        catch (e) {
            return [];
        }
    }
}
exports.Listing = Listing;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The unique identifier of the listing' }),
    __metadata("design:type", String)
], Listing.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The title of the listing' }),
    __metadata("design:type", String)
], Listing.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Detailed description of the listing' }),
    __metadata("design:type", String)
], Listing.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['C2C', 'B2B', 'B2C'],
        description: 'The type of listing (C2C, B2B, or B2C)'
    }),
    __metadata("design:type", String)
], Listing.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The price of the item' }),
    __metadata("design:type", Number)
], Listing.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category of the listing' }),
    __metadata("design:type", String)
], Listing.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Comma-separated tags for the listing',
        example: 'electronics,gadgets,new'
    }),
    __metadata("design:type", String)
], Listing.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Commission rate for the listing (if applicable)',
        nullable: true
    }),
    __metadata("design:type", Number)
], Listing.prototype, "commissionRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        default: false,
        description: 'Whether the price is negotiable'
    }),
    __metadata("design:type", Boolean)
], Listing.prototype, "isNegotiable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Comma-separated URLs of listing images',
        nullable: true
    }),
    __metadata("design:type", String)
], Listing.prototype, "imageUrls", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the user who created the listing' }),
    __metadata("design:type", String)
], Listing.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        default: true,
        description: 'Whether the listing is active'
    }),
    __metadata("design:type", Boolean)
], Listing.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        default: 0,
        description: 'Number of views for the listing'
    }),
    __metadata("design:type", Number)
], Listing.prototype, "views", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['PENDING', 'APPROVED', 'REJECTED', 'SOLD'],
        description: 'Current status of the listing'
    }),
    __metadata("design:type", String)
], Listing.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'When the listing was created' }),
    __metadata("design:type", Date)
], Listing.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'When the listing was last updated' }),
    __metadata("design:type", Date)
], Listing.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Object, required: false }),
    __metadata("design:type", Object)
], Listing.prototype, "user", void 0);
//# sourceMappingURL=listing.entity.js.map