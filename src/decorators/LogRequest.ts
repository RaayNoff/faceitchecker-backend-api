import { Logger } from '@nestjs/common';
import { Request } from 'express';
import { ContextDto } from './Context';

const logger = new Logger('HTTP');

export function LogRequest(): MethodDecorator {
    return (target, propertyKey, descriptor: TypedPropertyDescriptor<any>) => {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const { request, ipAddress }: ContextDto = args[args.length - 1];

            if (!request || !request.method) {
                logger.warn(`@LogRequest: не удалось получить объект типа request`);
                return originalMethod.apply(this, args);
            }

            const logParts: string[] = [];
            logParts.push(request.method);
            if (ipAddress) {logParts.push(ipAddress);}
            logParts.push(new Date().toISOString().replace('T', ' ').substring(0, 16));
            logParts.push(`Handler: ${String(propertyKey)}`);

            if (request.params && Object.keys(request.params).length)
            {logParts.push(`Params: ${JSON.stringify(request.params)}`);}

            if (request.body && Object.keys(request.body).length)
            {logParts.push(`Body: ${JSON.stringify(request.body)}`);}

            if (request.query && Object.keys(request.query).length)
            {logParts.push(`Query: ${JSON.stringify(request.query)}`);}

            logger.log(logParts.join(' - '));

            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}
