import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FollowsService {
  constructor(private prisma: PrismaService) {}

  async follow(followerId: string, followingId: string) {
    const existing = await this.prisma.follow.findFirst({ where: { followerId, followingId } });
    if (existing) return existing;
    return this.prisma.follow.create({ data: { followerId, followingId } });
  }

  async unfollow(followerId: string, followingId: string) {
    return this.prisma.follow.deleteMany({ where: { followerId, followingId } });
  }

  async getFollowing(userId: string) {
    return this.prisma.follow.findMany({ where: { followerId: userId } });
  }

  async getFollowers(userId: string) {
    return this.prisma.follow.findMany({ where: { followingId: userId } });
  }
}
