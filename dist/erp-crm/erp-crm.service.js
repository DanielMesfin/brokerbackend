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
let ErpCrmService = class ErpCrmService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createCustomer(createCustomerDto) {
        return this.prisma.customer.create({
            data: {
                ...createCustomerDto,
            },
        });
    }
    async findAllCustomers() {
        return this.prisma.customer.findMany({
            orderBy: {
                companyName: 'asc',
            },
        });
    }
    async findCustomerById(id) {
        const customer = await this.prisma.customer.findUnique({
            where: { id },
        });
        if (!customer) {
            throw new common_1.NotFoundException(`Customer with ID ${id} not found`);
        }
        return customer;
    }
    async updateCustomer(id, updateData) {
        await this.findCustomerById(id);
        return this.prisma.customer.update({
            where: { id },
            data: updateData,
        });
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