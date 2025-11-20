import { Controller, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { JwtPrismaGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('api/users')
export class FollowsController {
  constructor(private readonly follows: FollowsService) {}

  @Post(':id/follow')
  @UseGuards(JwtPrismaGuard)
  follow(@Param('id') id: string, @CurrentUser() user) {
    return this.follows.follow(user.id, id);
  }

  @Delete(':id/follow')
  @UseGuards(JwtPrismaGuard)
  unfollow(@Param('id') id: string, @CurrentUser() user) {
    return this.follows.unfollow(user.id, id);
  }

  @Post(':id/following')
  getFollowing(@Param('id') id: string) {
    return this.follows.getFollowing(id);
  }
}
