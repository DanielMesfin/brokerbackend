import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { UploadsController } from '../uploads/uploads.controller';
import { StorageModule } from '../storage/storage.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, StorageModule],
  controllers: [PostsController, UploadsController],
  providers: [PostsService]
})
export class PostsModule {}
