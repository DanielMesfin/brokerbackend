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
exports.ErpCrmService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
function mapPrismaCustomerToCustomer(prismaCustomer) {
    var _a, _b, _c, _d, _e;
    return {
        ...prismaCustomer,
        phone: (_a = prismaCustomer.phone) !== null && _a !== void 0 ? _a : undefined,
        billingAddress: (_b = prismaCustomer.billingAddress) !== null && _b !== void 0 ? _b : undefined,
        shippingAddress: (_c = prismaCustomer.shippingAddress) !== null && _c !== void 0 ? _c : undefined,
        taxId: (_d = prismaCustomer.taxId) !== null && _d !== void 0 ? _d : undefined,
        paymentTerms: (_e = prismaCustomer.paymentTerms) !== null && _e !== void 0 ? _e : undefined,
    };
}
let ErpCrmService = class ErpCrmService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createCustomer(createCustomerDto) {
        var _a, _b, _c, _d, _e;
        const customer = await this.prisma.customer.create({
            data: {
                ...createCustomerDto,
                phone: (_a = createCustomerDto.phone) !== null && _a !== void 0 ? _a : null,
                billingAddress: (_b = createCustomerDto.billingAddress) !== null && _b !== void 0 ? _b : null,
                shippingAddress: (_c = createCustomerDto.shippingAddress) !== null && _c !== void 0 ? _c : null,
                taxId: (_d = createCustomerDto.taxId) !== null && _d !== void 0 ? _d : null,
                paymentTerms: (_e = createCustomerDto.paymentTerms) !== null && _e !== void 0 ? _e : null,
            },
        });
        return mapPrismaCustomerToCustomer(customer);
    }
    async findAllCustomers() {
        const customers = await this.prisma.customer.findMany({
            orderBy: {
                companyName: 'asc',
            },
        });
        return customers.map(mapPrismaCustomerToCustomer);
    }
    async findCustomerById(id) {
        const customer = await this.prisma.customer.findUnique({
            where: { id },
        });
        if (!customer) {
            throw new common_1.NotFoundException(`Customer with ID ${id} not found`);
        }
        return mapPrismaCustomerToCustomer(customer);
    }
    async updateCustomer(id, updateData) {
        var _a, _b, _c, _d, _e;
        await this.findCustomerById(id);
        const customer = await this.prisma.customer.update({
            where: { id },
            data: {
                ...updateData,
                phone: (_a = updateData.phone) !== null && _a !== void 0 ? _a : null,
                billingAddress: (_b = updateData.billingAddress) !== null && _b !== void 0 ? _b : null,
                shippingAddress: (_c = updateData.shippingAddress) !== null && _c !== void 0 ? _c : null,
                taxId: (_d = updateData.taxId) !== null && _d !== void 0 ? _d : null,
                paymentTerms: (_e = updateData.paymentTerms) !== null && _e !== void 0 ? _e : null,
            },
        });
        return mapPrismaCustomerToCustomer(customer);
    }
    async deleteCustomer(id) {
        await this.findCustomerById(id);
        await this.prisma.customer.delete({
            where: { id },
        });
    }
};
exports.ErpCrmService = ErpCrmService;
exports.ErpCrmService = ErpCrmService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ErpCrmService);
//# sourceMappingURL=erp-crm.service.js.map