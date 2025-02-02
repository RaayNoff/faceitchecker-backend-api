import { Controller, Get, Query } from '@nestjs/common';
import { PlayerStatsService } from './player-stats.service';
import { PlayerStatsInputSearchDto } from './dtos/PlayerStatsInputSearchDto';

@Controller('player-stats')
export class PlayerStatsController {
  constructor(protected readonly playerStatsService: PlayerStatsService) {}

  @Get()
  public getPlayerStats(@Query() dto: PlayerStatsInputSearchDto) {
    return this.playerStatsService.getPlayerStats(dto.inputRaw);
  }
}
