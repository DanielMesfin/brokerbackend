"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const business_entity_1 = require("./entities/business.entity");
const business_document_entity_1 = require("./entities/business-document.entity");
const business_verification_entity_1 = require("./entities/business-verification.entity");
const business_compliance_entity_1 = require("./entities/business-compliance.entity");
const business_controller_1 = require("./business.controller");
const business_service_1 = require("./business.service");
const auth_module_1 = require("../auth/auth.module");
let BusinessModule = class BusinessModule {
};
exports.BusinessModule = BusinessModule;
exports.BusinessModule = BusinessModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                business_entity_1.Business,
                business_document_entity_1.BusinessDocument,
                business_verification_entity_1.BusinessVerification,
                business_compliance_entity_1.BusinessCompliance,
            ]),
            config_1.ConfigModule,
            auth_module_1.AuthModule,
        ],
        controllers: [business_controller_1.BusinessController],
        providers: [business_service_1.BusinessService],
        exports: [business_service_1.BusinessService],
    })
], BusinessModule);
//# sourceMappingURL=business.module.js.map