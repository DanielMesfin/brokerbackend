import { ApiProperty } from '@nestjs/swagger';

export class ConversationResponseDto {
  @ApiProperty({ description: 'Unique identifier of the conversation' })
  id: string;

  @ApiProperty({ description: 'ID of the listing being discussed', nullable: true })
  listingId: string | null;

  @ApiProperty({ description: 'ID of the buyer user', nullable: true })
  buyerUserId: string | null;

  @ApiProperty({ description: 'ID of the seller user', nullable: true })
  sellerUserId: string | null;

  @ApiProperty({ 
    enum: ['DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED'],
    default: 'DRAFT',
    description: 'Current status of the conversation'
  })
  status: string;

  @ApiProperty({ type: Date, description: 'When the conversation was created' })
  createdAt: Date;

  @ApiProperty({ type: Date, description: 'When the conversation was last updated' })
  updatedAt: Date;

  @ApiProperty({ type: () => [MessageDto], description: 'Messages in this conversation' })
  messages: MessageDto[];

  @ApiProperty({ type: () => [AgentRunDto], description: 'Agent runs associated with this conversation' })
  agentRuns: AgentRunDto[];

  @ApiProperty({ type: () => [DraftOrderDto], description: 'Draft orders created in this conversation' })
  draftOrders: DraftOrderDto[];
}

// Re-export the DTOs that are used in the response
import { MessageDto } from './ai-agent.dtos';
import { AgentRunDto } from './ai-agent.dtos';
import { DraftOrderDto } from './ai-agent.dtos';
