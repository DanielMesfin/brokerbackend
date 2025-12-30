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
exports.AiAgentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AiAgentService = class AiAgentService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async startConversation(params) {
        var _a, _b, _c;
        const convo = await this.prisma.conversation.create({
            data: {
                listingId: (_a = params.listingId) !== null && _a !== void 0 ? _a : null,
                buyerUserId: (_b = params.buyerUserId) !== null && _b !== void 0 ? _b : null,
                sellerUserId: (_c = params.sellerUserId) !== null && _c !== void 0 ? _c : null,
                status: 'OPEN',
            },
            include: {
                messages: true,
                draftOrders: true,
                agentRuns: true,
            },
        });
        if (params.initialText) {
            await this.prisma.message.create({
                data: {
                    conversationId: convo.id,
                    senderType: 'USER',
                    text: params.initialText,
                },
            });
            await this.generateAgentReply(convo.id, params.initialText);
            return this.getConversation(convo.id);
        }
        return this.mapToConversationDto(convo);
    }
    async addUserMessageAndRespond(conversationId, userId, text) {
        const convo = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
        if (!convo)
            throw new common_1.NotFoundException('Conversation not found');
        await this.prisma.message.create({
            data: { conversationId, senderType: 'USER', text },
        });
        await this.generateAgentReply(conversationId, text);
        return this.getConversation(conversationId);
    }
    mapToConversationDto(convo) {
        return {
            id: convo.id,
            listingId: convo.listingId,
            buyerUserId: convo.buyerUserId,
            sellerUserId: convo.sellerUserId,
            status: convo.status,
            createdAt: convo.createdAt,
            updatedAt: convo.updatedAt,
            messages: convo.messages || [],
            agentRuns: convo.agentRuns || [],
            draftOrders: (convo.draftOrders || []).map((order) => {
                var _a, _b;
                return ({
                    id: order.id,
                    conversationId: order.conversationId,
                    listingId: order.listingId,
                    buyerUserId: order.buyerUserId,
                    sellerUserId: order.sellerUserId,
                    quantity: order.quantity,
                    priceAgreed: (_a = order.priceAgreed) !== null && _a !== void 0 ? _a : undefined,
                    status: order.status,
                    shippingInfo: (_b = order.shippingInfo) !== null && _b !== void 0 ? _b : undefined,
                    createdAt: order.createdAt,
                    updatedAt: order.updatedAt
                });
            })
        };
    }
    async getConversation(conversationId) {
        const convo = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                messages: { orderBy: { createdAt: 'asc' } },
                draftOrders: true,
                agentRuns: true,
            },
        });
        if (!convo)
            throw new common_1.NotFoundException('Conversation not found');
        return this.mapToConversationDto(convo);
    }
    async adminDecision(conversationId, adminUserId, status, notes) {
        const convo = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
        if (!convo)
            throw new common_1.NotFoundException('Conversation not found');
        await this.prisma.agentRun.create({
            data: {
                conversationId,
                input: JSON.stringify({ action: 'ADMIN_DECISION', status, notes }),
                output: JSON.stringify({ ok: true }),
                decision: status === 'APPROVED' ? 'PLACE_ORDER' : 'CLOSE',
            },
        });
        await this.prisma.message.create({
            data: {
                conversationId,
                senderType: 'ADMIN',
                text: status === 'APPROVED' ? 'Admin approved. Proceeding with order.' : 'Admin rejected the request.',
                metadata: notes ? JSON.stringify({ notes }) : null,
            },
        });
        return this.getConversation(conversationId);
    }
    async generateAgentReply(conversationId, userText) {
        const normalized = userText.toLowerCase();
        let reply = '';
        let decision = 'ASK';
        if (normalized.includes('price')) {
            reply = 'The listed price applies. How many units do you want to order?';
            decision = 'ASK';
        }
        else if (normalized.match(/\b(\d+)\b/)) {
            const qty = parseInt((normalized.match(/\b(\d+)\b/) || ['', '0'])[1], 10);
            reply = `Noted ${qty}. Please share delivery area and a contact phone number.`;
            decision = 'COLLECT';
        }
        else if (normalized.includes('confirm')) {
            const lastQtyMsg = await this.prisma.message.findFirst({
                where: { conversationId, text: { contains: 'Noted ' } },
                orderBy: { createdAt: 'desc' },
            });
            let qty = 1;
            if (lastQtyMsg) {
                const m = lastQtyMsg.text.match(/Noted (\d+)/);
                if (m)
                    qty = parseInt(m[1], 10);
            }
            const convo = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
            if ((convo === null || convo === void 0 ? void 0 : convo.listingId) && (convo === null || convo === void 0 ? void 0 : convo.buyerUserId) && (convo === null || convo === void 0 ? void 0 : convo.sellerUserId)) {
                await this.prisma.draftOrder.create({
                    data: {
                        conversationId,
                        listingId: convo.listingId,
                        buyerUserId: convo.buyerUserId,
                        sellerUserId: convo.sellerUserId,
                        quantity: qty,
                        status: 'PENDING',
                    },
                });
                reply = 'Draft order created and pending confirmation.';
                decision = 'PLACE_ORDER';
            }
            else {
                reply = 'Thanks. I need the listing and party details to place a draft order.';
                decision = 'ASK';
            }
        }
        else if (normalized.includes('agent') && normalized.includes('human')) {
            reply = 'I will escalate this conversation to a human operator.';
            decision = 'ESCALATE';
        }
        else {
            reply = 'How can I help with buying or selling this item? You can ask about price, availability, or place an order.';
            decision = 'ASK';
        }
        await this.prisma.agentRun.create({
            data: {
                conversationId,
                input: JSON.stringify({ userText }),
                output: JSON.stringify({ reply }),
                decision,
            },
        });
        await this.prisma.message.create({
            data: { conversationId, senderType: 'AGENT', text: reply },
        });
    }
};
exports.AiAgentService = AiAgentService;
exports.AiAgentService = AiAgentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AiAgentService);
//# sourceMappingURL=ai-agent.service.js.map