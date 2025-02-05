import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { SteamAPIUrlEnum } from './enums/SteamAPIUrlEnum';
import { firstValueFrom } from 'rxjs';
import { IResolveVanitySteamResponse } from './interfaces/IResolveVanitySteamResponse';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SteamApiService {
    constructor(
    private readonly HttpService: HttpService,
    private readonly configService: ConfigService,
    ) {}

    public async resolveVanity(vanityName: string) {
        const { data } = await firstValueFrom(
            this.HttpService.get<IResolveVanitySteamResponse>(
                SteamAPIUrlEnum.ResolveVanityURL,
                {
                    method: 'GET',
                    headers: {
                        'x-webapi-key': this.configService.get<string>(
                            'STEAM_API_AUTHORIZATION_TOKEN',
                        ),
                    },
                    params: {
                        vanityurl: vanityName,
                    },
                },
            ),
        );

        return data.response;
    }
}
