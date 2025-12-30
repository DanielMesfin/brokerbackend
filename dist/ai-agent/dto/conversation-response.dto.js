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
exports.ConversationResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ConversationResponseDto {
}
exports.ConversationResponseDto = ConversationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier of the conversation' }),
    __metadata("design:type", String)
], ConversationResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the listing being discussed', nullable: true }),
    __metadata("design:type", Object)
], ConversationResponseDto.prototype, "listingId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the buyer user', nullable: true }),
    __metadata("design:type", Object)
], ConversationResponseDto.prototype, "buyerUserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the seller user', nullable: true }),
    __metadata("design:type", Object)
], ConversationResponseDto.prototype, "sellerUserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED'],
        default: 'DRAFT',
        description: 'Current status of the conversation'
    }),
    __metadata("design:type", String)
], ConversationResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, description: 'When the conversation was created' }),
    __metadata("design:type", Date)
], ConversationResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, description: 'When the conversation was last updated' }),
    __metadata("design:type", Date)
], ConversationResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => [ai_agent_dtos_1.MessageDto], description: 'Messages in this conversation' }),
    __metadata("design:type", Array)
], ConversationResponseDto.prototype, "messages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => [ai_agent_dtos_2.AgentRunDto], description: 'Agent runs associated with this conversation' }),
    __metadata("design:type", Array)
], ConversationResponseDto.prototype, "agentRuns", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => [ai_agent_dtos_3.DraftOrderDto], description: 'Draft orders created in this conversation' }),
    __metadata("design:type", Array)
], ConversationResponseDto.prototype, "draftOrders", void 0);
const ai_agent_dtos_1 = require("./ai-agent.dtos");
const ai_agent_dtos_2 = require("./ai-agent.dtos");
const ai_agent_dtos_3 = require("./ai-agent.dtos");
//# sourceMappingURL=conversation-response.dto.js.map