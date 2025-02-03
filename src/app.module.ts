import { Module } from '@nestjs/common';
import { SteamApiModule } from './steam/steam-api.module';
import { ConfigModule } from '@nestjs/config';
import { PlayerStatsModule } from './player-stats/player-stats.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    SteamApiModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PlayerStatsModule,
    ThrottlerModule.forRoot([
      {
        ttl: 10,
        limit: 10,
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
