import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SteamApiService } from './services/steam-api.service';

@Module({
    imports: [HttpModule],
    controllers: [],
    providers: [SteamApiService],
    exports: [SteamApiService],
})
export class SteamApiModule {}
