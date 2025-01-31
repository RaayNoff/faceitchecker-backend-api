import { Module } from '@nestjs/common';
import { SteamApiModule } from './steam/steam-api.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    SteamApiModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
