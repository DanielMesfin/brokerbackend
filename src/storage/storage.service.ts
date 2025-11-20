import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private s3: S3Client | null = null;
  constructor() {
    const region = process.env.AWS_REGION;
    const key = process.env.AWS_ACCESS_KEY_ID;
    const secret = process.env.AWS_SECRET_ACCESS_KEY;
    if (region && key && secret) {
      this.s3 = new S3Client({ region, credentials: { accessKeyId: key, secretAccessKey: secret } });
    }
  }

  async presignUpload(key: string, contentType = 'application/octet-stream') {
    if (!this.s3) {
      // no S3 configured — return instruction to use local upload
      return { uploadUrl: null, publicUrl: `/public/uploads/${key}` };
    }
    const cmd = new PutObjectCommand({ Bucket: process.env.AWS_S3_BUCKET, Key: key, ContentType: contentType });
    const url = await getSignedUrl(this.s3, cmd, { expiresIn: 3600 });
    const publicUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    return { uploadUrl: url, publicUrl };
  }
}
