import { Body, Controller, Get, Post } from '@nestjs/common';
import { PlayerStatsService } from './player-stats.service';
import { PlayerStatsInputDto } from './dtos/PlayerStatsInputDto';

@Controller('player-stats')
export class PlayerStatsController {
  constructor(protected readonly playerStatsService: PlayerStatsService) {}

  @Get()
  public getPlayerStats(@Body() dto: PlayerStatsInputDto) {
    return this.playerStatsService.getPlayerStats(dto.inputRaw);
  }
}
