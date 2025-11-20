import { Controller, Post, Body } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';

class PresignDto {
  key: string;
  contentType?: string;
}

@Controller('api/uploads')
export class UploadsController {
  constructor(private storage: StorageService) {}

  @Post('presign')
  async presign(@Body() body: PresignDto) {
    const key = body.key || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    return this.storage.presignUpload(key, body.contentType || 'application/octet-stream');
  }
}
