import { Module } from '@nestjs/common';
import { SteamApiModule } from './steam/steam-api.module';
import { ConfigModule } from '@nestjs/config';
import { PlayerStatsModule } from './player-stats/player-stats.module';

@Module({
  imports: [
    SteamApiModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PlayerStatsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
