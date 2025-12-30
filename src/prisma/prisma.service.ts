import { Injectable, OnModuleInit, OnModuleDestroy, Logger, INestApplication } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'error' | 'info' | 'warn'>
  implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
      errorFormat: 'pretty',
    });

    // Log all queries in development
    if (process.env.NODE_ENV === 'development') {
      this.$on('query' as const, (e) => {
        this.logger.debug(`Query: ${e.query}`, `Params: ${e.params}`, `Duration: ${e.duration}ms`);
      });
    }
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Successfully connected to the database');
    } catch (error) {
      this.logger.error('Failed to connect to the database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Successfully disconnected from the database');
    } catch (error) {
      this.logger.error('Error disconnecting from the database', error);
      throw error;
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    // Handle application shutdown with process events
    process.on('beforeExit', async () => {
      try {
        await app.close();
        this.logger.log('Application is shutting down...');
      } catch (error) {
        this.logger.error('Error during application shutdown', error);
        process.exit(1);
      }
    });

    // Handle other termination signals
    const signals = ['SIGTERM', 'SIGINT', 'SIGQUIT'];
    signals.forEach(signal => {
      process.on(signal, async () => {
        this.logger.log(`Received ${signal}. Gracefully shutting down...`);
        try {
          await app.close();
          this.logger.log('Successfully shut down application');
          process.exit(0);
        } catch (error) {
          this.logger.error('Error during shutdown', error);
          process.exit(1);
        }
      });
    });
  }
}
