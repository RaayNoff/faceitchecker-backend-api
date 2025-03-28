import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

function validateEnvVariables(configService: ConfigService) {
    const requiredEnvVars = [
        'FACEIT_API_AUTHORIZATION_TOKEN',
        'MATCHES_TO_COUNT',
    ];

    const missingVars = requiredEnvVars.filter((key) => !configService.get<string>(key));

    if (missingVars.length > 0) {
        throw new Error(`Отсутствуют обязательные переменные окружения: ${missingVars.join(', ')}`);
    }
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: true,
    });

    const configService = app.get(ConfigService);

    validateEnvVariables(configService);

    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('/api');

    const config = new DocumentBuilder()
        .setTitle('Faceit checker')
        .setDescription('Faceit checker API')
        .setVersion('1.0')
        .build();

    const documentFactory = SwaggerModule.createDocument(
        app,
        config,
    );

    SwaggerModule.setup('api/docs', app, documentFactory);

    await app.listen(process.env.PORT ?? 3000);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
