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
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: true,
        logger: ['error', 'warn', 'log']
    });
    app.use((0, helmet_1.default)());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const limiter = (0, express_rate_limit_1.rateLimit)({
        windowMs: 15 * 60 * 1000,
        max: 100,
    });
    app.use(limiter);
    const options = new swagger_1.DocumentBuilder()
        .setTitle('Social Media API')
        .setDescription('The social media API documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    try {
        const document = swagger_1.SwaggerModule.createDocument(app, options);
        swagger_1.SwaggerModule.setup('api', app, document, {
            swaggerOptions: {
                persistAuthorization: true,
            },
        });
        console.log('Swagger UI available at: http://localhost:' + (process.env.PORT || 8888) + '/api');
    }
    catch (err) {
        console.error('Swagger initialization error:', err);
    }
    const port = process.env.PORT || 8888;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map