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
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
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
        this.logger = new common_1.Logger(PrismaService_1.name);
        if (process.env.NODE_ENV === 'development') {
            this.$on('query', (e) => {
                this.logger.debug(`Query: ${e.query}`, `Params: ${e.params}`, `Duration: ${e.duration}ms`);
            });
        }
    }
    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('Successfully connected to the database');
        }
        catch (error) {
            this.logger.error('Failed to connect to the database', error);
            throw error;
        }
    }
    async onModuleDestroy() {
        try {
            await this.$disconnect();
            this.logger.log('Successfully disconnected from the database');
        }
        catch (error) {
            this.logger.error('Error disconnecting from the database', error);
            throw error;
        }
    }
    async enableShutdownHooks(app) {
        process.on('beforeExit', async () => {
            try {
                await app.close();
                this.logger.log('Application is shutting down...');
            }
            catch (error) {
                this.logger.error('Error during application shutdown', error);
                process.exit(1);
            }
        });
        const signals = ['SIGTERM', 'SIGINT', 'SIGQUIT'];
        signals.forEach(signal => {
            process.on(signal, async () => {
                this.logger.log(`Received ${signal}. Gracefully shutting down...`);
                try {
                    await app.close();
                    this.logger.log('Successfully shut down application');
                    process.exit(0);
                }
                catch (error) {
                    this.logger.error('Error during shutdown', error);
                    process.exit(1);
                }
            });
        });
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map