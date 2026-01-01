import { 
  Controller, Get, Post as HttpPost, Body, Param, Delete, 
  UploadedFile, UseInterceptors, Req, UseGuards, HttpStatus,
  NotFoundException, ForbiddenException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PostsService } from './posts.service';
import { JwtPrismaGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { 
  ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, 
  ApiConsumes, ApiBearerAuth, ApiProperty 
} from '@nestjs/swagger';

class CommentDto {
  @ApiProperty({ description: 'The content of the comment' })
  content: string;
}

class LikeResponse {
  @ApiProperty({ description: 'ID of the post' })
  postId: string;

  @ApiProperty({ description: 'Number of likes' })
  likes: number;
}

@ApiTags('Posts')
@ApiBearerAuth('JWT-auth')
@Controller('api/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @HttpPost()
  @UseGuards(JwtPrismaGuard)
  @UseInterceptors(FileInterceptor('media', {
    storage: diskStorage({
      destination: './public/uploads',
      filename: (req, file, cb) => {
        const name = `${Date.now()}${extname(file.originalname)}`;
        cb(null, name);
      }
    })
  }))
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Post created successfully' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create post with optional media',
    type: CreatePostDto,
  })
  create(
    @Body() createPostDto: CreatePostDto, 
    @UploadedFile() file: Express.Multer.File, 
    @CurrentUser() user: any
  ) {
    if (file) {
      createPostDto.media = [`/public/uploads/${file.filename}`];
    }
    createPostDto.authorId = createPostDto.authorId || user?.id;
    return this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns all posts' })
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns the post' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post not found' })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtPrismaGuard)
  @ApiOperation({ summary: 'Delete a post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Post deleted successfully' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden - Not the post owner' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    // First check if the post exists and belongs to the user
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.authorId !== user.id) {
      throw new ForbiddenException('You can only delete your own posts');
    }
    return this.postsService.remove(id);
  }

  @HttpPost(':id/like')
  @UseGuards(JwtPrismaGuard)
  @ApiOperation({ summary: 'Like a post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Post liked successfully',
    type: LikeResponse
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  like(@Param('id') id: string, @CurrentUser() user: any) {
    return this.postsService.addLike(id, user.id);
  }

  @Delete(':id/like')
  @UseGuards(JwtPrismaGuard)
  @ApiOperation({ summary: 'Remove like from a post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Like removed successfully',
    type: LikeResponse
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  unlike(@Param('id') id: string, @CurrentUser() user: any) {
    return this.postsService.removeLike(id, user.id);
  }

  @HttpPost(':id/comment')
  @UseGuards(JwtPrismaGuard)
  @ApiOperation({ summary: 'Add a comment to a post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiBody({ type: CommentDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Comment added successfully' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  comment(
    @Param('id') id: string, 
    @Body() body: { content: string }, 
    @CurrentUser() user: any
  ) {
    return this.postsService.addComment(id, user.id, body.content);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get all comments for a post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns all comments for the post' })
  comments(@Param('id') id: string) {
    return this.postsService.getComments(id);
  }
}
