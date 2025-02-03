import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PlayerStatsService } from './player-stats.service';
import { PlayerStatsInputSearchDto } from './dtos/PlayerStatsInputSearchDto';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('player-stats')
@UseGuards(ThrottlerGuard)
export class PlayerStatsController {
  constructor(protected readonly playerStatsService: PlayerStatsService) {}

  @Get()
  public getPlayerStats(@Query() dto: PlayerStatsInputSearchDto) {
    return this.playerStatsService.getPlayerStats(dto.inputRaw);
  }
}
