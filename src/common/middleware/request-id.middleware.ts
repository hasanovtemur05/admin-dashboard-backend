import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        req.headers['x-request-id'] = req.headers['x-request-id'] || `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
        next();
    }
}