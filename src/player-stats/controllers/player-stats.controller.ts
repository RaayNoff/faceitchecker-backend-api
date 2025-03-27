import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PlayerStatsService } from '../services/player-stats.service';
import { PlayerStatsInputSearchDto } from '../dtos/player-stats-input-search.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { LogRequest } from '../../decorators/LogRequest';
import { Context, ContextDto } from '../../decorators/Context';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PlayerStatsDetailSchema } from '../dtos/player-stats-detail-schema.dto';

@ApiTags('Player stats')
@Controller('player-stats')
@UseGuards(ThrottlerGuard)
export class PlayerStatsController {
    constructor(protected readonly playerStatsService: PlayerStatsService) {}

    @Get()
    @ApiOperation({
        summary: 'Get all cs2, csgo and premier player stats'
    })
    @ApiQuery({
        type: PlayerStatsInputSearchDto,
    })
    @ApiOkResponse({
        type: PlayerStatsDetailSchema
    })
    @LogRequest()
    public getPlayerStats(
        @Query() dto: PlayerStatsInputSearchDto,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        @Context() context: ContextDto,
    ) {
        return this.playerStatsService.getPlayerStats(dto.inputRaw);
    }
}
