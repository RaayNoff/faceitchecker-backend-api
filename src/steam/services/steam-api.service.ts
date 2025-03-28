import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { IResolveVanitySteamResponse } from '../interfaces/IResolveVanitySteamResponse';
import { SteamAPIUrlEnum } from '../enums/SteamAPIUrlEnum';

@Injectable()
export class SteamApiService {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
    }

    public async resolveVanity(vanityName: string) {
        const { data } = await firstValueFrom(
            this.httpService.get<IResolveVanitySteamResponse>(
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
