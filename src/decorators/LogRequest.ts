import { Logger } from '@nestjs/common';
import { Request } from 'express';
import { ContextDto } from './Context';

const logger = new Logger('HTTP');

export function LogRequest(): MethodDecorator {
    return (target, propertyKey, descriptor: TypedPropertyDescriptor<any>) => {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            // Последний аргумент метода контроллера — это Request (Nest сам передаёт его)
            const {request}: ContextDto = args[args.length - 1]; // В NestJS первым параметром в метод контроллера всегда передаётся `req`

            if (!request || !request.method) {
                logger.warn(`@LogRequest: не удалось получить объект типа request`);
                return originalMethod.apply(this, args);
            }

            const method = request.method;
            const url = request.url;
            const ip = request.ip;
            const params = request.params;
            const body = request.body;
            const query = request.query;
            const timestamp = new Date().toISOString();

            logger.log(
                `${method} ${url} - ${ip} - ${timestamp} - Handler: ${String(propertyKey)} - Params: ${JSON.stringify(params)} - Body: ${JSON.stringify(body)} - Query: ${JSON.stringify(query)}`
            );

            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}
