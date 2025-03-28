import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { SteamApiModule } from './steam/steam-api.module';
import { PlayerStatsModule } from './player-stats/player-stats.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ThrottlerModule.forRoot([
            {
                ttl: 10000,
                limit: 10,
            },
        ]),
        SteamApiModule,
        PlayerStatsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
