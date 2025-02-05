import { Module } from '@nestjs/common';
import { SteamApiService } from './steam-api.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    controllers: [],
    providers: [SteamApiService],
    exports: [SteamApiService],
})
export class SteamApiModule {}
