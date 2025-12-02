"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = require("express-rate-limit");
const swagger_1 = require("@nestjs/swagger");
const prisma_service_1 = require("./prisma/prisma.service");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, {
            cors: true,
            logger: ['error', 'warn', 'log']
        });
        const prismaService = app.get(prisma_service_1.PrismaService);
        await prismaService.enableShutdownHooks(app);
        app.use((0, helmet_1.default)());
        const limiter = (0, express_rate_limit_1.rateLimit)({
            windowMs: 15 * 60 * 1000,
            max: 100,
        });
        app.use(limiter);
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }));
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Social Media API')
            .setDescription('The social media API documentation')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api', app, document, {
            swaggerOptions: {
                persistAuthorization: true,
            },
        });
        const port = process.env.PORT || 8888;
        await app.listen(port);
        logger.log(`Application is running on: http://localhost:${port}`);
        logger.log(`Swagger UI available at: http://localhost:${port}/api`);
    }
    catch (error) {
        logger.error('Error during application startup', error);
        process.exit(1);
    }
}
bootstrap().catch(error => {
    console.error('Fatal error during application startup:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map