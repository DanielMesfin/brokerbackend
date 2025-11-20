import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    const post = await this.prisma.post.create({
      data: {
        content: createPostDto.content,
        media: createPostDto.media ? JSON.stringify(createPostDto.media) : '[]',
        authorId: createPostDto.authorId || null
      }
    });
    return {
      ...post,
      media: post.media ? JSON.parse(post.media as string) : []
    };
  }

  async findAll() {
    const posts = await this.prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
    const results = await Promise.all(
      posts.map(async (p) => {
        const likes = await this.prisma.like.count({ where: { postId: p.id } });
        const comments = await this.prisma.comment.count({ where: { postId: p.id } });
        return { ...p, likesCount: likes, commentsCount: comments };
      })
    );
    return results;
  }

  async findOne(id: string) {
    const p = await this.prisma.post.findUnique({ where: { id } });
    if (!p) return null;
    const likes = await this.prisma.like.count({ where: { postId: id } });
    const comments = await this.prisma.comment.findMany({ where: { postId: id }, orderBy: { createdAt: 'asc' } });
    return { ...p, likesCount: likes, comments };
  }

  async remove(id: string) {
    return this.prisma.post.delete({ where: { id } });
  }

  async addLike(postId: string, userId: string) {
    const existing = await this.prisma.like.findFirst({ where: { postId, userId } });
    if (existing) return existing;
    return this.prisma.like.create({ data: { postId, userId } });
  }

  async removeLike(postId: string, userId: string) {
    return this.prisma.like.deleteMany({ where: { postId, userId } });
  }

  async addComment(postId: string, userId: string, content: string) {
    return this.prisma.comment.create({ 
      data: { 
        postId, 
        authorId: userId,
        content 
      } 
    });
  }

  async getComments(postId: string) {
    return this.prisma.comment.findMany({ where: { postId }, orderBy: { createdAt: 'asc' } });
  }
}
