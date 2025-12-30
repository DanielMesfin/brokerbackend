import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConversationResponseDto } from './dto/conversation-response.dto';

@Injectable()
export class AiAgentService {
  constructor(private prisma: PrismaService) {}

  async startConversation(params: {
    listingId?: string;
    buyerUserId?: string;
    sellerUserId?: string;
    initialText?: string;
  }): Promise<ConversationResponseDto> {
    const convo = await this.prisma.conversation.create({
      data: {
        listingId: params.listingId ?? null,
        buyerUserId: params.buyerUserId ?? null,
        sellerUserId: params.sellerUserId ?? null,
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
      
      // Refresh the conversation to include the new message and agent run
      return this.getConversation(convo.id);
    }

    return this.mapToConversationDto(convo);
  }

  async addUserMessageAndRespond(conversationId: string, userId: string, text: string): Promise<ConversationResponseDto> {
    const convo = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!convo) throw new NotFoundException('Conversation not found');

    await this.prisma.message.create({
      data: { conversationId, senderType: 'USER', text },
    });

    await this.generateAgentReply(conversationId, text);

    return this.getConversation(conversationId);
  }

  private mapToConversationDto(convo: any): ConversationResponseDto {
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
      draftOrders: (convo.draftOrders || []).map((order: any) => ({
        id: order.id,
        conversationId: order.conversationId,
        listingId: order.listingId,
        buyerUserId: order.buyerUserId,
        sellerUserId: order.sellerUserId,
        quantity: order.quantity,
        priceAgreed: order.priceAgreed ?? undefined,
        status: order.status,
        shippingInfo: order.shippingInfo ?? undefined,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }))
    };
  }

  async getConversation(conversationId: string): Promise<ConversationResponseDto> {
    const convo = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
        draftOrders: true,
        agentRuns: true,
      },
    });
    if (!convo) throw new NotFoundException('Conversation not found');
    return this.mapToConversationDto(convo);
  }

  async adminDecision(conversationId: string, adminUserId: string, status: 'APPROVED' | 'REJECTED', notes?: string): Promise<ConversationResponseDto> {
    const convo = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!convo) throw new NotFoundException('Conversation not found');

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

  private async generateAgentReply(conversationId: string, userText: string) {
    // Simple rules-based agent for MVP
    const normalized = userText.toLowerCase();
    let reply = '';
    let decision: 'ASK' | 'COLLECT' | 'PLACE_ORDER' | 'ESCALATE' | 'CLOSE' = 'ASK';

    if (normalized.includes('price')) {
      reply = 'The listed price applies. How many units do you want to order?';
      decision = 'ASK';
    } else if (normalized.match(/\b(\d+)\b/)) {
      const qty = parseInt((normalized.match(/\b(\d+)\b/) || ['','0'])[1], 10);
      reply = `Noted ${qty}. Please share delivery area and a contact phone number.`;
      decision = 'COLLECT';
    } else if (normalized.includes('confirm')) {
      // Create a draft order if we have at least one previous number collected
      const lastQtyMsg = await this.prisma.message.findFirst({
        where: { conversationId, text: { contains: 'Noted ' } },
        orderBy: { createdAt: 'desc' },
      });
      let qty = 1;
      if (lastQtyMsg) {
        const m = lastQtyMsg.text.match(/Noted (\d+)/);
        if (m) qty = parseInt(m[1], 10);
      }
      const convo = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
      if (convo?.listingId && convo?.buyerUserId && convo?.sellerUserId) {
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
      } else {
        reply = 'Thanks. I need the listing and party details to place a draft order.';
        decision = 'ASK';
      }
    } else if (normalized.includes('agent') && normalized.includes('human')) {
      reply = 'I will escalate this conversation to a human operator.';
      decision = 'ESCALATE';
    } else {
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
}
