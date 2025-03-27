import { BadRequestException, Injectable } from '@nestjs/common';
import { RawInputTypeEnum } from '../enums/RawInputTypeEnum';
import { SteamApiService } from '../../steam/services/steam-api.service';

@Injectable()
export class ParamsResolverService {
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
        [RawInputTypeEnum.FACEIT_NICKNAME, this.getParamsNickname.bind(this)],
        [RawInputTypeEnum.STEAM_ID64, this.getParamsSteamId64.bind(this)],
        [RawInputTypeEnum.STEAM_URL, this.getParamsBySteamUrl.bind(this)],
    ]);

    constructor(
        private readonly steamAPIService: SteamApiService,
    ) {
    }

    public async getParamsToFetchWith(rawFromInput: string) {
        const trimmedInput = rawFromInput.trim();
        const inputType = this.detectInputType(trimmedInput);

        if (!inputType) {
            throw new BadRequestException(`Cannot determine input type by prompt: ${trimmedInput}`);
        }

        const fetchFunction = this.FetchByTypeMap.get(inputType);

        if (!fetchFunction) {
            throw new BadRequestException(`Cannot determine type of fetch by prompt: ${trimmedInput}`);
        }


        return fetchFunction(trimmedInput);
    }

    private async getParamsNickname(nickname: string) {
        return { nickname };
    }

    private async getParamsSteamId64(steamId64: string) {
        return { game_player_id: steamId64 }
    }

    private async getParamsBySteamUrl(steamUrl: string) {
        const steamId64 = await this.resolveSteamId64(steamUrl);
        if (!steamId64) {
            console.error('Не удалось извлечь SteamID64 из ссылки:', steamUrl);
            return null;
        }
        return this.getParamsSteamId64(steamId64);
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

        const dataFromSteam = await this.steamAPIService.resolveVanity(vanityName);

        return dataFromSteam.steamid;
    }

    private detectInputType(input: string) {
        for (const [rawInputType, regExp] of this.RegExpMap.entries()) {
            if (regExp.test(input)) {
                return rawInputType;
            }
        }

        return null;
    }
}
