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
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
let StorageService = class StorageService {
    constructor() {
        this.s3 = null;
        const region = process.env.AWS_REGION;
        const key = process.env.AWS_ACCESS_KEY_ID;
        const secret = process.env.AWS_SECRET_ACCESS_KEY;
        if (region && key && secret) {
            this.s3 = new client_s3_1.S3Client({ region, credentials: { accessKeyId: key, secretAccessKey: secret } });
        }
    }
    async presignUpload(key, contentType = 'application/octet-stream') {
        if (!this.s3) {
            return { uploadUrl: null, publicUrl: `/public/uploads/${key}` };
        }
        const cmd = new client_s3_1.PutObjectCommand({ Bucket: process.env.AWS_S3_BUCKET, Key: key, ContentType: contentType });
        const url = await (0, s3_request_presigner_1.getSignedUrl)(this.s3, cmd, { expiresIn: 3600 });
        const publicUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        return { uploadUrl: url, publicUrl };
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], StorageService);
//# sourceMappingURL=storage.service.js.map