import { Module } from '@nestjs/common';
import { SteamApiController } from './steam-api.controller';
import { SteamApiService } from './steam-api.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [SteamApiController],
  providers: [SteamApiService],
})
export class SteamApiModule {}
