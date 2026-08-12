import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(3000),
    DATABASE_URL: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES_IN: Joi.string().default('3600s'),
    JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
    REDIS_HOST: Joi.string().default('localhost'),
    REDIS_PORT: Joi.number().default(6379),
    MEILISEARCH_HOST: Joi.string().default('http://localhost:7700'),
    MEILISEARCH_API_KEY: Joi.string().allow('').optional(),
    S3_ENDPOINT: Joi.string().default('localhost'),
    S3_PORT: Joi.number().default(9000),
    S3_ACCESS_KEY: Joi.string().allow('').optional(),
    S3_SECRET_KEY: Joi.string().allow('').optional(),
    S3_BUCKET: Joi.string().default('market-bucket'),
    S3_USE_SSL: Joi.boolean().default(false),
});