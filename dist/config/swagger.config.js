"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerOptions = exports.swaggerConfig = void 0;
const swagger_1 = require("@nestjs/swagger");
exports.swaggerConfig = new swagger_1.DocumentBuilder()
    .setTitle('Social Media API')
    .setDescription(`
  # Social Media API Documentation

  Welcome to the Social Media API documentation. This API provides endpoints for:
  - User authentication and authorization
  - Post management
  - Comments and interactions
  - User profiles and relationships
  - Marketing and sales management (listings, transactions)
  - ERP/CRM system for B2B operations (customers, orders, invoicing)

  ## Authentication
  Most endpoints require authentication. Use the \`/auth/login\` endpoint to get a JWT token, then click the **Authorize** button above and enter your token.

  ## Rate Limiting
  The API is rate limited to 100 requests per 15 minutes per IP address.
  `)
    .setVersion('1.0')
    .addBearerAuth({
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    name: 'JWT',
    description: 'Enter JWT token',
    in: 'header',
}, 'JWT-auth')
    .addApiKey({
    type: 'apiKey',
    name: 'x-api-key',
    in: 'header',
    description: 'API key for external services',
}, 'api-key')
    .addServer('http://localhost:8888', 'Development Server')
    .addServer('https://api.yourdomain.com', 'Production Server')
    .addTag('Authentication', 'User authentication and registration')
    .addTag('Users', 'User management and profiles')
    .addTag('Posts', 'Post management')
    .addTag('Comments', 'Comments on posts')
    .addTag('Likes', 'Post likes management')
    .addTag('marketing-sales', 'Marketing and sales management')
    .addTag('erp-crm', 'ERP/CRM System for B2B operations')
    .setContact('Support', 'https://yourdomain.com/support', 'support@yourdomain.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();
exports.swaggerOptions = {
    swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true,
        defaultModelExpandDepth: 3,
        defaultModelsExpandDepth: 3,
        tagsSorter: 'alpha',
        operationsSorter: 'method',
        tryItOutEnabled: true,
        displayRequestDuration: true,
        requestSnippetsEnabled: true,
        requestSnippets: {
            generators: {
                curl_bash: {
                    title: 'cURL (bash)',
                    syntax: 'bash',
                },
                curl_powershell: {
                    title: 'cURL (PowerShell)',
                    syntax: 'powershell',
                    snippet: 'curl -X ${method} "${location}" \\\n' +
                        '  -H "Content-Type: application/json" \\\n' +
                        '  -H "Authorization: Bearer ${token}" \\\n' +
                        '  ${body}',
                },
            },
        },
    },
    customSiteTitle: 'Social Media API Documentation',
    customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #3b4151; }
    .swagger-ui .opblock-tag { font-size: 16px; }
  `,
    customfavIcon: 'https://yourdomain.com/favicon.ico',
};
//# sourceMappingURL=swagger.config.js.map