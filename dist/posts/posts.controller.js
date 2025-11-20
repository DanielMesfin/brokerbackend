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
exports.PostsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const posts_service_1 = require("./posts.service");
const auth_guard_1 = require("../auth/auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const create_post_dto_1 = require("./dto/create-post.dto");
const swagger_1 = require("@nestjs/swagger");
class CommentDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The content of the comment' }),
    __metadata("design:type", String)
], CommentDto.prototype, "content", void 0);
class LikeResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the post' }),
    __metadata("design:type", String)
], LikeResponse.prototype, "postId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of likes' }),
    __metadata("design:type", Number)
], LikeResponse.prototype, "likes", void 0);
let PostsController = class PostsController {
    constructor(postsService) {
        this.postsService = postsService;
    }
    create(createPostDto, file, req, user) {
        if (file) {
            createPostDto.media = [`/public/uploads/${file.filename}`];
        }
        createPostDto.authorId = createPostDto.authorId || (user === null || user === void 0 ? void 0 : user.id);
        return this.postsService.create(createPostDto);
    }
    findAll() {
        return this.postsService.findAll();
    }
    findOne(id) {
        return this.postsService.findOne(id);
    }
    async remove(id, user) {
        const post = await this.postsService.findOne(id);
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        if (post.authorId !== user.id) {
            throw new common_1.ForbiddenException('You can only delete your own posts');
        }
        return this.postsService.remove(id);
    }
    like(id, user) {
        return this.postsService.addLike(id, user.id);
    }
    unlike(id, user) {
        return this.postsService.removeLike(id, user.id);
    }
    comment(id, body, user) {
        return this.postsService.addComment(id, user.id, body.content);
    }
    comments(id) {
        return this.postsService.getComments(id);
    }
};
exports.PostsController = PostsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtPrismaGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('media', {
        storage: (0, multer_1.diskStorage)({
            destination: './public/uploads',
            filename: (req, file, cb) => {
                const name = `${Date.now()}${(0, path_1.extname)(file.originalname)}`;
                cb(null, name);
            }
        })
    })),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new post' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'Post created successfully' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: 'Unauthorized' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'Create post with optional media',
        type: create_post_dto_1.CreatePostDto,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_post_dto_1.CreatePostDto, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all posts' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Returns all posts' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get post by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Post ID' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Returns the post' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Post not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.JwtPrismaGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a post' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Post ID' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Post deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.FORBIDDEN, description: 'Forbidden - Not the post owner' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/like'),
    (0, common_1.UseGuards)(auth_guard_1.JwtPrismaGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Like a post' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Post ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Post liked successfully',
        type: LikeResponse
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "like", null);
__decorate([
    (0, common_1.Delete)(':id/like'),
    (0, common_1.UseGuards)(auth_guard_1.JwtPrismaGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Remove like from a post' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Post ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Like removed successfully',
        type: LikeResponse
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "unlike", null);
__decorate([
    (0, common_1.Post)(':id/comment'),
    (0, common_1.UseGuards)(auth_guard_1.JwtPrismaGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Add a comment to a post' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Post ID' }),
    (0, swagger_1.ApiBody)({ type: CommentDto }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'Comment added successfully' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "comment", null);
__decorate([
    (0, common_1.Get)(':id/comments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all comments for a post' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Post ID' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Returns all comments for the post' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "comments", null);
exports.PostsController = PostsController = __decorate([
    (0, swagger_1.ApiTags)('Posts'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('api/posts'),
    __metadata("design:paramtypes", [posts_service_1.PostsService])
], PostsController);
//# sourceMappingURL=posts.controller.js.map