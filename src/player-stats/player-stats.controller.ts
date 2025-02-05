import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PlayerStatsService } from './player-stats.service';
import { PlayerStatsInputSearchDto } from './dtos/PlayerStatsInputSearchDto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { LogRequest } from '../decorators/LogRequest';
import { Context, ContextDto } from '../decorators/Context';

@Controller('player-stats')
@UseGuards(ThrottlerGuard)
export class PlayerStatsController {
    constructor(protected readonly playerStatsService: PlayerStatsService) {}

     @Get()
     @LogRequest()
    public getPlayerStats(@Query() dto: PlayerStatsInputSearchDto, @Context() context: ContextDto) {
        return this.playerStatsService.getPlayerStats(dto.inputRaw);
    }
}
