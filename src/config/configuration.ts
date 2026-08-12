export default () => ({
    port: Number(process.env.PORT) || 3000,
    database: {
        url: process.env.DATABASE_URL,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'change-me',
        expiresIn: process.env.JWT_EXPIRES_IN || '3600s',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
    },
    meilisearch: {
        host: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
        apiKey: process.env.MEILISEARCH_API_KEY || '',
    },
    s3: {
        endpoint: process.env.S3_ENDPOINT || 'localhost',
        port: Number(process.env.S3_PORT) || 9000,
        accessKey: process.env.S3_ACCESS_KEY || '',
        secretKey: process.env.S3_SECRET_KEY || '',
        bucket: process.env.S3_BUCKET || 'market-bucket',
        useSsl: process.env.S3_USE_SSL === 'true',
    },
    throttle: {
        ttl: Number(process.env.THROTTLE_TTL) || 60000,
        limit: Number(process.env.THROTTLE_LIMIT) || 100,
    },
});