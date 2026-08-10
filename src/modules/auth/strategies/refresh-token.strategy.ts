import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token') {
    constructor() {
        super();
    }

    validate(req: any): any {
        const refreshToken = req.body?.refreshToken;
        return refreshToken ? { refreshToken } : null;
    }
}