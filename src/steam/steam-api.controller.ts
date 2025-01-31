import { Controller, Get, Param } from '@nestjs/common';
import { SteamApiService } from './steam-api.service';

@Controller('steam-api')
export class SteamApiController {
  constructor(private readonly steamService: SteamApiService) {}

  @Get('/resolveVanity/:vanityName')
  public resolveVanity(@Param('vanityName') vanityName: string) {
    return this.steamService.resolveVanity(vanityName);
  }
}
