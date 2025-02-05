import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as requestIp from '@supercharge/request-ip';
import { Request } from 'express';

export declare class ContextDto {
    request: Request;
    ipAddress: string;
    userAgent?: string;
    language?: string;
}

export const Context = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<Request>();

        const ipAddress = requestIp.getClientIp(request);

        return {
            request,
            ipAddress: ipAddress,
            userAgent: request.headers['user-agent'],
            language: request.headers['accept-language'],
        } as ContextDto;
    },
);
