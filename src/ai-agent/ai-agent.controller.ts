import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AiAgentService } from './ai-agent.service';

class StartConversationDto {
  listingId?: string;
  buyerUserId?: string;
  sellerUserId?: string;
  initialText?: string;
}

class UserMessageDto {
  text: string;
}

@ApiTags('AI Agent')
@Controller('api/agent')
export class AiAgentController {
  constructor(private agent: AiAgentService) {}

  @Post('conversations')
  @ApiOperation({ summary: 'Start an AI conversation for a listing/order intent' })
  @ApiBody({ type: StartConversationDto })
  @ApiResponse({ status: 201 })
  async start(@Body() body: StartConversationDto) {
    return this.agent.startConversation(body);
  }

  @Post('conversations/:id/messages')
  @ApiOperation({ summary: 'Send a user message and get AI reply' })
  @ApiBody({ type: UserMessageDto })
  async send(@Param('id') id: string, @Body() body: UserMessageDto) {
    return this.agent.addUserMessageAndRespond(id, undefined as any, body.text);
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Get conversation with messages and drafts' })
  async get(@Param('id') id: string) {
    return this.agent.getConversation(id);
  }
}
