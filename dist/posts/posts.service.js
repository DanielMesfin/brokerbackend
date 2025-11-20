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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PostsService = class PostsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createPostDto) {
        const post = await this.prisma.post.create({
            data: {
                content: createPostDto.content,
                media: createPostDto.media ? JSON.stringify(createPostDto.media) : '[]',
                authorId: createPostDto.authorId || null
            }
        });
        return {
            ...post,
            media: post.media ? JSON.parse(post.media) : []
        };
    }
    async findAll() {
        const posts = await this.prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
        const results = await Promise.all(posts.map(async (p) => {
            const likes = await this.prisma.like.count({ where: { postId: p.id } });
            const comments = await this.prisma.comment.count({ where: { postId: p.id } });
            return { ...p, likesCount: likes, commentsCount: comments };
        }));
        return results;
    }
    async findOne(id) {
        const p = await this.prisma.post.findUnique({ where: { id } });
        if (!p)
            return null;
        const likes = await this.prisma.like.count({ where: { postId: id } });
        const comments = await this.prisma.comment.findMany({ where: { postId: id }, orderBy: { createdAt: 'asc' } });
        return { ...p, likesCount: likes, comments };
    }
    async remove(id) {
        return this.prisma.post.delete({ where: { id } });
    }
    async addLike(postId, userId) {
        const existing = await this.prisma.like.findFirst({ where: { postId, userId } });
        if (existing)
            return existing;
        return this.prisma.like.create({ data: { postId, userId } });
    }
    async removeLike(postId, userId) {
        return this.prisma.like.deleteMany({ where: { postId, userId } });
    }
    async addComment(postId, userId, content) {
        return this.prisma.comment.create({
            data: {
                postId,
                authorId: userId,
                content
            }
        });
    }
    async getComments(postId) {
        return this.prisma.comment.findMany({ where: { postId }, orderBy: { createdAt: 'asc' } });
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostsService);
//# sourceMappingURL=posts.service.js.map