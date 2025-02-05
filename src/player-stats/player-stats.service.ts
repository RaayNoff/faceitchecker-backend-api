import { Injectable } from '@nestjs/common';
import { RawInputTypeEnum } from './enums/RawInputTypeEnum';
import { IFaceitPlayer } from './interfaces/IFaceitPlayer';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { APIUrlEnum } from './enums/APIUrlEnum';
import { HttpService } from '@nestjs/axios';
import { SteamApiService } from '../steam/steam-api.service';

@Injectable()
export class PlayerStatsService {
    private readonly RegExpMap = new Map<string, RegExp>([
        [RawInputTypeEnum.STEAM_ID64, /^\d{17}$/],
        [RawInputTypeEnum.FACEIT_NICKNAME, /^[a-zA-Z0-9_\-]{3,16}$/],
        [
            RawInputTypeEnum.STEAM_URL,
            /^https?:\/\/steamcommunity\.com\/(profiles\/\d{17}|id\/[a-zA-Z0-9_-]+)\/?$/,
        ],
    ]);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    private readonly FetchByTypeMap = new Map<string, Function>([
        [RawInputTypeEnum.FACEIT_NICKNAME, this.fetchByNickName.bind(this)],
        [RawInputTypeEnum.STEAM_ID64, this.fetchBySteamId64.bind(this)],
        [RawInputTypeEnum.STEAM_URL, this.fetchBySteamUrl.bind(this)],
    ]);

    constructor(
    private readonly HttpService: HttpService,
    private readonly configService: ConfigService,
    private readonly steamAPIService: SteamApiService,
    ) {}

    public async getPlayerStats(
        rawFromInput: string,
    ): Promise<IFaceitPlayer | null> {
        const trimmedInput = rawFromInput.trim();

        const inputType = this.detectInputType(trimmedInput);

        if (!inputType) {
            return null;
        }

        const fetchFunction = this.FetchByTypeMap.get(inputType);


        return fetchFunction ? await fetchFunction(trimmedInput) : null;
    }

    private detectInputType(input: string) {
        for (const [rawInputType, regExp] of this.RegExpMap.entries()) {
            if (regExp.test(input)) {
                return rawInputType;
            }
        }

        return null;
    }

    private async fetchByNickName(nickname: string) {
        return await this.fetchPlayer({ nickname });
    }

    private async fetchBySteamId64(steamId64: string) {
        return await this.fetchPlayer({ game_player_id: steamId64 });
    }

    private async fetchBySteamUrl(steamUrl: string) {
        const steamId64 = await this.resolveSteamId64(steamUrl);
        if (!steamId64) {
            console.error('Не удалось извлечь SteamID64 из ссылки:', steamUrl);
            return null;
        }
        return this.fetchBySteamId64(steamId64);
    }

    private async resolveSteamId64(steamUrl: string) {
        const steamIdMatch = steamUrl.match(/profiles\/(\d{17})/);
        if (steamIdMatch) {
            return steamIdMatch[1];
        }

        const customUrlMatch = steamUrl.match(/id\/([a-zA-Z0-9_-]+)/);
        if (!customUrlMatch) {
            return null;
        }

        const vanityName = customUrlMatch[1];

        const zalupa = await this.steamAPIService.resolveVanity(vanityName);

        return zalupa.steamid;
    }

    private test() {

    }

    private async fetchPlayer(params: Record<string, string>) {
        const { data } = await firstValueFrom(
            this.HttpService.get<IFaceitPlayer>(
                `${APIUrlEnum.FACEIT_PLAYER_DETAILS}`,
                {
                    headers: {
                        Authorization:
              `Bearer ` +
              this.configService.get<string>('FACEIT_API_AUTHORIZATION_TOKEN'),
                    },
                    params: {
                        ...params,
                        game: 'cs2',
                    },
                },
            ),
        );

        return data;
    }
}
