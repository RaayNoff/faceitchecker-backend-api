import {
    Controller, Get, Query, UseGuards,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import {
    ApiOkResponse, ApiOperation, ApiQuery, ApiTags,
} from '@nestjs/swagger';
import { PlayerStatsService } from '../services/player-stats.service';
import { PlayerStatsInputSearchDto } from '../dtos/player-stats-input-search.dto';
import { LogRequest } from '../../decorators/LogRequest';
import { Context, ContextDto } from '../../decorators/Context';
import { PlayerStatsDetailSchema } from '../dtos/player-stats-detail-schema.dto';

@ApiTags('Player stats')
@Controller('player-stats')
@UseGuards(ThrottlerGuard)
export class PlayerStatsController {
    constructor(protected readonly playerStatsService: PlayerStatsService) {
    }

  @Get()
  @ApiOperation({
      summary: 'Get all cs2, csgo and premier player stats',
  })
  @ApiQuery({
      type: PlayerStatsInputSearchDto,
  })
  @ApiOkResponse({
      type: PlayerStatsDetailSchema,
  })
  @LogRequest()
    public getPlayerStats(
    @Query() dto: PlayerStatsInputSearchDto,
    // eslint-disable-next-line no-unused-vars
    @Context() _context: ContextDto,
    ) {
        return this.playerStatsService.getPlayerStats(dto.inputRaw);
    }
}
