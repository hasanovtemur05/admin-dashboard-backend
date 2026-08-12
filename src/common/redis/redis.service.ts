import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name);
    private client: RedisClientType;

    constructor(host: string, port: number) {
        this.client = createClient({
            socket: { host, port },
        });

        this.client.on('error', (err) => {
            this.logger.error('Redis Client Error', err);
        });

        this.client.connect().catch(() => {
            this.logger.warn('Failed to connect to Redis. Running without cache.');
        });
    }

    async onModuleDestroy() {
        if (this.client?.isOpen) {
            await this.client.quit();
        }
    }

    async get(key: string): Promise<string | null> {
        try {
            return await this.client.get(key);
        } catch {
            return null;
        }
    }

    async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
        try {
            if (ttlSeconds) {
                await this.client.setEx(key, ttlSeconds, value);
            } else {
                await this.client.set(key, value);
            }
        } catch {
            // Ignore cache errors
        }
    }

    async del(key: string): Promise<void> {
        try {
            await this.client.del(key);
        } catch {
            // Ignore cache errors
        }
    }

    async delPattern(pattern: string): Promise<void> {
        try {
            const keys = await this.client.keys(pattern);
            if (keys.length > 0) {
                await this.client.del(keys);
            }
        } catch {
            // Ignore cache errors
        }
    }

    async flush(): Promise<void> {
        try {
            await this.client.flushAll();
        } catch {
            // Ignore cache errors
        }
    }
}
