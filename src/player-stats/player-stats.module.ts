import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PlayerStatsController } from './controllers/player-stats.controller';
import { PlayerStatsService } from './services/player-stats.service';
import { SteamApiModule } from '../steam/steam-api.module';
import { ParamsResolverService } from './services/params-resolver.service';
import { CalculationService } from './services/calculation.service';
import { FetchService } from './services/fetch.service';

@Module({
    imports: [HttpModule, SteamApiModule],
    controllers: [PlayerStatsController],
    providers: [PlayerStatsService, ParamsResolverService, CalculationService, FetchService],
})
export class PlayerStatsModule {
}
