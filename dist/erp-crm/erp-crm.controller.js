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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErpCrmController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const erp_crm_service_1 = require("./erp-crm.service");
const create_customer_dto_1 = require("./dto/create-customer.dto");
const customer_entity_1 = require("./entities/customer.entity");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const decorators_1 = require("@nestjs/common/decorators");
let ErpCrmController = class ErpCrmController {
    constructor(erpCrmService) {
        this.erpCrmService = erpCrmService;
    }
    async createCustomer(createCustomerDto) {
        return this.erpCrmService.createCustomer(createCustomerDto);
    }
    async findAllCustomers() {
        return this.erpCrmService.findAllCustomers();
    }
    async findCustomerById(id) {
        return this.erpCrmService.findCustomerById(id);
    }
    async updateCustomer(id, updateData) {
        return this.erpCrmService.updateCustomer(id, updateData);
    }
    async deleteCustomer(id) {
        return this.erpCrmService.deleteCustomer(id);
    }
};
exports.ErpCrmController = ErpCrmController;
__decorate([
    (0, common_1.Post)('customers'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new customer' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Customer successfully created.', type: customer_entity_1.Customer }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_customer_dto_1.CreateCustomerDto]),
    __metadata("design:returntype", Promise)
], ErpCrmController.prototype, "createCustomer", null);
__decorate([
    (0, common_1.Get)('customers'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all customers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all customers.', type: [customer_entity_1.Customer] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ErpCrmController.prototype, "findAllCustomers", null);
__decorate([
    (0, common_1.Get)('customers/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a customer by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the customer.', type: customer_entity_1.Customer }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Customer not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ErpCrmController.prototype, "findCustomerById", null);
__decorate([
    (0, common_1.Put)('customers/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a customer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Customer successfully updated.', type: customer_entity_1.Customer }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Customer not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ErpCrmController.prototype, "updateCustomer", null);
__decorate([
    (0, common_1.Delete)('customers/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a customer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Customer successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Customer not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ErpCrmController.prototype, "deleteCustomer", null);
exports.ErpCrmController = ErpCrmController = __decorate([
    (0, swagger_1.ApiTags)('erp-crm'),
    (0, common_1.Controller)('erp-crm'),
    (0, decorators_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [erp_crm_service_1.ErpCrmService])
], ErpCrmController);
//# sourceMappingURL=erp-crm.controller.js.map