import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AiAgentService } from './ai-agent.service';
import { 
  StartConversationDto, 
  UserMessageDto, 
  MessageDto
} from './dto/ai-agent.dtos';
import { ConversationResponseDto } from './dto/conversation-response.dto';
import { 
  AgentRunDto,
  DraftOrderDto 
} from './dto/ai-agent.dtos';

@ApiTags('AI Agent')
@Controller('api/agent')
export class AiAgentController {
  constructor(private agent: AiAgentService) {}

  @Post('conversations')
  @ApiOperation({ 
    summary: 'Start an AI conversation for a listing/order intent',
    description: 'Initiates a new conversation between a buyer and seller about a specific listing.'
  })
  @ApiBody({ 
    type: StartConversationDto,
    description: 'Details needed to start a conversation',
    required: true 
  })
  @ApiResponse({ 
    status: 201, 
    description: 'The conversation has been successfully created.',
    type: ConversationResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Listing, buyer, or seller not found' })
  async start(@Body() body: StartConversationDto): Promise<ConversationResponseDto> {
    return this.agent.startConversation(body);
  }

  @Post('conversations/:id/messages')
  @ApiOperation({ 
    summary: 'Send a user message and get AI reply',
    description: 'Sends a message in an existing conversation and gets the AI\'s response.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID of the conversation',
    required: true 
  })
  @ApiBody({ 
    type: UserMessageDto,
    description: 'The message content',
    required: true 
  })
  @ApiResponse({ 
    status: 201, 
    description: 'The message has been sent and AI response is returned.',
    type: ConversationResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async send(
    @Param('id') id: string, 
    @Body() body: UserMessageDto
  ): Promise<ConversationResponseDto> {
    return this.agent.addUserMessageAndRespond(id, undefined as any, body.text);
  }

  @Get('conversations/:id')
  @ApiOperation({ 
    summary: 'Get conversation with messages and drafts',
    description: 'Retrieves a conversation including all messages, agent runs, and draft orders.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID of the conversation to retrieve',
    required: true 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'The conversation details',
    type: ConversationResponseDto
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async get(@Param('id') id: string): Promise<ConversationResponseDto> {
    return this.agent.getConversation(id);
  }
}
