import { Module } from '@nestjs/common';
import { PlayerStatsController } from './player-stats.controller';
import { PlayerStatsService } from './player-stats.service';
import { HttpModule } from '@nestjs/axios';
import { SteamApiModule } from '../steam/steam-api.module';

@Module({
    imports: [HttpModule, SteamApiModule],
    controllers: [PlayerStatsController],
    providers: [PlayerStatsService],
})
export class PlayerStatsModule {}
