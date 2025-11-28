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
exports.AiAgentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ai_agent_service_1 = require("./ai-agent.service");
class StartConversationDto {
}
class UserMessageDto {
}
let AiAgentController = class AiAgentController {
    constructor(agent) {
        this.agent = agent;
    }
    async start(body) {
        return this.agent.startConversation(body);
    }
    async send(id, body) {
        return this.agent.addUserMessageAndRespond(id, undefined, body.text);
    }
    async get(id) {
        return this.agent.getConversation(id);
    }
};
exports.AiAgentController = AiAgentController;
__decorate([
    (0, common_1.Post)('conversations'),
    (0, swagger_1.ApiOperation)({ summary: 'Start an AI conversation for a listing/order intent' }),
    (0, swagger_1.ApiBody)({ type: StartConversationDto }),
    (0, swagger_1.ApiResponse)({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [StartConversationDto]),
    __metadata("design:returntype", Promise)
], AiAgentController.prototype, "start", null);
__decorate([
    (0, common_1.Post)('conversations/:id/messages'),
    (0, swagger_1.ApiOperation)({ summary: 'Send a user message and get AI reply' }),
    (0, swagger_1.ApiBody)({ type: UserMessageDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UserMessageDto]),
    __metadata("design:returntype", Promise)
], AiAgentController.prototype, "send", null);
__decorate([
    (0, common_1.Get)('conversations/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get conversation with messages and drafts' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiAgentController.prototype, "get", null);
exports.AiAgentController = AiAgentController = __decorate([
    (0, swagger_1.ApiTags)('AI Agent'),
    (0, common_1.Controller)('api/agent'),
    __metadata("design:paramtypes", [ai_agent_service_1.AiAgentService])
], AiAgentController);
//# sourceMappingURL=ai-agent.controller.js.map