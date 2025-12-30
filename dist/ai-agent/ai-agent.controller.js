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
const ai_agent_dtos_1 = require("./dto/ai-agent.dtos");
const conversation_response_dto_1 = require("./dto/conversation-response.dto");
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
    (0, swagger_1.ApiOperation)({
        summary: 'Start an AI conversation for a listing/order intent',
        description: 'Initiates a new conversation between a buyer and seller about a specific listing.'
    }),
    (0, swagger_1.ApiBody)({
        type: ai_agent_dtos_1.StartConversationDto,
        description: 'Details needed to start a conversation',
        required: true
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The conversation has been successfully created.',
        type: conversation_response_dto_1.ConversationResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing, buyer, or seller not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ai_agent_dtos_1.StartConversationDto]),
    __metadata("design:returntype", Promise)
], AiAgentController.prototype, "start", null);
__decorate([
    (0, common_1.Post)('conversations/:id/messages'),
    (0, swagger_1.ApiOperation)({
        summary: 'Send a user message and get AI reply',
        description: 'Sends a message in an existing conversation and gets the AI\'s response.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID of the conversation',
        required: true
    }),
    (0, swagger_1.ApiBody)({
        type: ai_agent_dtos_1.UserMessageDto,
        description: 'The message content',
        required: true
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The message has been sent and AI response is returned.',
        type: conversation_response_dto_1.ConversationResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Conversation not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ai_agent_dtos_1.UserMessageDto]),
    __metadata("design:returntype", Promise)
], AiAgentController.prototype, "send", null);
__decorate([
    (0, common_1.Get)('conversations/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get conversation with messages and drafts',
        description: 'Retrieves a conversation including all messages, agent runs, and draft orders.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID of the conversation to retrieve',
        required: true
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The conversation details',
        type: conversation_response_dto_1.ConversationResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Conversation not found' }),
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