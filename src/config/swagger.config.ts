import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Business Collaboration Platform API')
  .setDescription(`
  # Business Collaboration Platform API Documentation

  Welcome to the Business Collaboration Platform API. This API provides endpoints for:
  - User authentication and authorization (including OAuth2 with Google and Facebook)
  - Business profile management
  - Promotion and campaign management
  - User engagement and social features
  - Business collaboration tools
  - Regulatory compliance management

  ## Authentication
  The API supports multiple authentication methods:
  - JWT Bearer token (for API access)
  - OAuth2 with Google
  - OAuth2 with Facebook
  - API Key for external services

  For JWT authentication, use the \`/auth/login\` endpoint to get a token, then click the **Authorize** button above and enter your token.

  ## Rate Limiting
  The API is rate limited to 1000 requests per 15 minutes per IP address for authenticated users.
  `)
  .setVersion('2.0')
  .addOAuth2({
    type: 'oauth2',
    description: 'OAuth2 authentication with Google',
    name: 'Google OAuth2',
    flows: {
      implicit: {
        authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        scopes: {
          'https://www.googleapis.com/auth/userinfo.profile': 'View your basic profile info',
          'https://www.googleapis.com/auth/userinfo.email': 'View your email address',
        },
      },
    },
  })
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'JWT-auth',
  )
  .addApiKey(
    {
      type: 'apiKey',
      name: 'x-api-key',
      in: 'header',
      description: 'API key for external services',
    },
    'api-key',
  )
  .addServer('http://localhost:8888', 'Development Server')
  .addServer('https://api.yourdomain.com', 'Production Server')
  
  // Authentication & User Management
  .addTag('Authentication', 'User authentication and registration')
  .addTag('Users', 'User management and profiles')
  .addTag('Sessions', 'User session management')
  .addTag('Accounts', 'Linked OAuth accounts')
  
  // Business Features
  .addTag('Business', 'Business profile management')
  .addTag('Promotions', 'Promotion management')
  .addTag('Campaigns', 'Marketing campaigns')
  
  // Social & Engagement
  .addTag('Posts', 'Content posts')
  .addTag('Comments', 'Comments on posts')
  .addTag('Likes', 'Engagement metrics')
  .addTag('Connections', 'User connections and networking')
  
  // Compliance & Administration
  .addTag('Regulations', 'Regulatory information')
  .addTag('Compliance', 'Compliance management')
  .addTag('Verification', 'User and business verification')
  .addTag('erp-crm', 'ERP/CRM System for B2B operations')
  .setContact(
    'Support',
    'https://yourdomain.com/support',
    'support@yourdomain.com',
  )
  .setLicense('MIT', 'https://opensource.org/licenses/MIT')
  .build();

export const swaggerOptions = {
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