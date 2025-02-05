import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as requestIp from '@supercharge/request-ip';

export declare class ContextDto {
    request: any;
    ipAddress: string;
    userAgent?: string;
    language?: string;
}
export const Context = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();

        const ipAddress = requestIp.getClientIp(request);

        return {
            request,
            ipAddress: ipAddress,
            userAgent: request.headers['user-agent'],
            language: request.headers['accept-language'],
        } as ContextDto;
    },
);
