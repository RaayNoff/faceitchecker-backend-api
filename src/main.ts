import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: true,
    });

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
