import { Module } from '@nestjs/common';
import { SteamApiModule } from './steam/steam-api.module';
import { ConfigModule } from '@nestjs/config';
import { PlayerStatsModule } from './player-stats/player-stats.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { DevModule } from './dev/dev.module';

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
        DevModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
