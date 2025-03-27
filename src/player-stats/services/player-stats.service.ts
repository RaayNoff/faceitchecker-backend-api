import { Injectable } from '@nestjs/common';
import { IFaceitPlayer } from '../interfaces/IFaceitPlayer';
import { PlayerStatsDetailSchema } from '../dtos/player-stats-detail-schema.dto';
import { ParamsResolverService } from './params-resolver.service';
import { CalculationService } from './calculation.service';
import { ConfigService } from '@nestjs/config';
import { FetchService } from './fetch.service';
import { GameIDEnum } from '../enums/GameIDEnum';
import {
    FACEIT_COUNTRY_POSITION,
    FACEIT_ELO_APPLIES,
    FACEIT_GENERAL_GAME_STATS,
    FACEIT_MATCHES_STATS,
    FACEIT_PLAYER_DETAILS,
    FACEIT_REGION_POSITION,
} from '../constants/apiUrls';
import { IPosition } from '../interfaces/IPosition';
import { IGeneralGameStats } from '../interfaces/IGeneralGameStats';
import { ILastMatchesStats } from '../interfaces/ILastMatchesStats';
import { IEloApplies } from '../interfaces/IEloApplies';

@Injectable()
export class PlayerStatsService {
    private readonly STEAM_PROFILE_URL = 'https://steamcommunity.com/profiles/';
    private readonly MATCHES_TO_COUNT: number;

    constructor(
        private readonly calculationService: CalculationService,
        private readonly paramsResolverService: ParamsResolverService,
        private readonly configService: ConfigService,
        private readonly fetchService: FetchService,
    ) {
        this.MATCHES_TO_COUNT = this.configService.get<number>('MATCHES_TO_COUNT') || 0;
    }

    public async getPlayerStats(rawFromInput: string): Promise<PlayerStatsDetailSchema | null> {
        const faceitPlayer = await this.fetchPlayerData(rawFromInput);
        if (!faceitPlayer) {return null;}

        const cs2Stats = await this.fetchGameStats(faceitPlayer, GameIDEnum.CS2);
        const csgoStats = await this.fetchGameStats(faceitPlayer, GameIDEnum.CSGO);

        return {
            faceitName: faceitPlayer.nickname,
            faceitUrl: faceitPlayer.faceit_url,
            steamName: faceitPlayer.steam_nickname,
            steamUrl: `${this.STEAM_PROFILE_URL}${faceitPlayer.steam_id_64}`,
            profilePictureUrl: faceitPlayer.avatar,
            country: faceitPlayer.country,
            cs2: cs2Stats ? this.mapGameStats(cs2Stats, faceitPlayer.games.cs2, GameIDEnum.CS2) : null,
            'cs:go': csgoStats ? this.mapGameStats(csgoStats, faceitPlayer.games.csgo, GameIDEnum.CSGO) : null,
        } as PlayerStatsDetailSchema;
    }

    private async fetchPlayerData(rawFromInput: string): Promise<IFaceitPlayer | null> {
        const response = await this.fetchService.get<IFaceitPlayer>(
            FACEIT_PLAYER_DETAILS,
            { params: await this.paramsResolverService.getParamsToFetchWith(rawFromInput) },
            true,
        );
        return response?.data || null;
    }

    private async fetchGameStats(faceitPlayer: IFaceitPlayer, game: GameIDEnum) {
        const [generalStats, lastMatchesStats, eloApplies, regionPosition, countryPosition] = await Promise.all([
            this.fetchService.get<IGeneralGameStats>(FACEIT_GENERAL_GAME_STATS(faceitPlayer.player_id, game), {}, true),
            this.fetchService.get<ILastMatchesStats>(FACEIT_MATCHES_STATS(faceitPlayer.player_id, game), { params: {limit: this.MATCHES_TO_COUNT} }, true),
            this.fetchService.get<IEloApplies[]>(FACEIT_ELO_APPLIES(faceitPlayer.player_id, game), { params: {size: this.MATCHES_TO_COUNT, game_mode: '5v5'} }, false),
            this.fetchService.get<IPosition>(FACEIT_REGION_POSITION(faceitPlayer.player_id, game, faceitPlayer.games[game].region), {}, true),
            this.fetchService.get<IPosition>(FACEIT_COUNTRY_POSITION(faceitPlayer.player_id, game, faceitPlayer.games[game].region, faceitPlayer.country), {}, true),
        ]);

        return {
            generalStats: generalStats?.data || null,
            lastMatchesStats: lastMatchesStats?.data || null,
            eloApplies: eloApplies?.data || [],
            regionPosition: regionPosition?.data || null,
            countryPosition: countryPosition?.data || null,
        };
    }

    private mapGameStats(stats: any, gameData: any, game: GameIDEnum) {
        if (!stats.generalStats || !stats.regionPosition || !stats.countryPosition) {return null;}

        return {
            general: {
                lvl: gameData.skill_level,
                elo: gameData.faceit_elo,
                KD: Number(stats.generalStats.lifetime['Average K/D Ratio']),
                eloToRankDown: this.calculationService.getEloToUpOrDown(game, gameData.skill_level, gameData.faceit_elo, 'down'),
                eloToRankUp: this.calculationService.getEloToUpOrDown(game, gameData.skill_level, gameData.faceit_elo, 'up'),
                matchesCount: Number(stats.generalStats.lifetime.Matches),
                winRate: Number(stats.generalStats.lifetime['Win Rate %']),
                regionPosition: stats.regionPosition.position,
                countryPosition: stats.countryPosition.position,
                region: gameData.region,
            },
            lastMatches: this.calculationService.getLastMatchesStatistic(stats.lastMatchesStats, stats.eloApplies),
        };
    }
}
