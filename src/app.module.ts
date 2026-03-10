import { Module } from '@nestjs/common';
import { SteamApiModule } from './steam/steam-api.module';
import { ConfigModule } from '@nestjs/config';
import { PlayerStatsModule } from './player-stats/player-stats.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ThrottlerModule.forRoot([
            {
                ttl: 10000,
                limit: 100,
            },
        ]),
        SteamApiModule,
        PlayerStatsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
