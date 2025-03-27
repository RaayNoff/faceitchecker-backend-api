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
        const mainResponse = await this.fetchService.get<IFaceitPlayer>(
            FACEIT_PLAYER_DETAILS,
            { params: await this.paramsResolverService.getParamsToFetchWith(rawFromInput) },
            true,
        );

        const faceitPlayer = mainResponse?.data as IFaceitPlayer;


        const requests = [
            { url: FACEIT_GENERAL_GAME_STATS(faceitPlayer.player_id, GameIDEnum.CS2), params: null, includeBearer: true },
            { url: FACEIT_MATCHES_STATS(faceitPlayer.player_id, GameIDEnum.CS2), params: { limit: this.MATCHES_TO_COUNT }, includeBearer: true },
            { url: FACEIT_ELO_APPLIES(faceitPlayer.player_id, GameIDEnum.CS2), params: { size: this.MATCHES_TO_COUNT, game_mode: '5v5' }, includeBearer: false },
            { url: FACEIT_GENERAL_GAME_STATS(faceitPlayer.player_id, GameIDEnum.CSGO), params: null, includeBearer: true },
            { url: FACEIT_MATCHES_STATS(faceitPlayer.player_id, GameIDEnum.CSGO), params: { limit: this.MATCHES_TO_COUNT }, includeBearer: true },
            { url: FACEIT_ELO_APPLIES(faceitPlayer.player_id, GameIDEnum.CSGO), params: { size: this.MATCHES_TO_COUNT, game_mode: '5v5' }, includeBearer: false },
        ];

        const [cs2GeneralStats, cs2LastMatchesStats, cs2EloApplies, csgoGeneralStats, csgoLastMatchesStats, csgoEloApplies] = await Promise.all(
            requests.map(({ url, params, includeBearer }) => this.fetchService.get(url, { params }, includeBearer))
        ).then(responses => responses.map(res => res?.data)) as [IGeneralGameStats, ILastMatchesStats, IEloApplies[], IGeneralGameStats, ILastMatchesStats, IEloApplies[]];

        const positions = [
            { url: FACEIT_REGION_POSITION(faceitPlayer.player_id, GameIDEnum.CS2, faceitPlayer.games.cs2.region), params: null, includeBearer: true },
            { url: FACEIT_COUNTRY_POSITION(faceitPlayer.player_id, GameIDEnum.CS2, faceitPlayer.games.cs2.region, faceitPlayer.country), params: null, includeBearer: true },
            { url: FACEIT_REGION_POSITION(faceitPlayer.player_id, GameIDEnum.CSGO, faceitPlayer.games.csgo.region), params: null, includeBearer: true },
            { url: FACEIT_COUNTRY_POSITION(faceitPlayer.player_id, GameIDEnum.CSGO, faceitPlayer.games.csgo.region, faceitPlayer.country), params: null, includeBearer: true },
        ];

        const [cs2RegionPosition, cs2CountryPosition, csgoRegionPosition, csgoCountryPosition] = await Promise.all(
            positions.map(({ url, params, includeBearer }) => this.fetchService.get(url, { params }, includeBearer))
        ).then(responses => responses.map(res => res?.data)) as [IPosition, IPosition, IPosition, IPosition];

        return {
            faceitName: faceitPlayer.nickname,
            faceitUrl: faceitPlayer.faceit_url,
            steamName: faceitPlayer.steam_nickname,
            steamUrl: `${this.STEAM_PROFILE_URL}${faceitPlayer.steam_id_64}`,
            profilePictureUrl: faceitPlayer.avatar,
            country: faceitPlayer.country,
            cs2: cs2GeneralStats ? {
                general: {
                    lvl: faceitPlayer.games.cs2.skill_level,
                    elo: faceitPlayer.games.cs2.faceit_elo,
                    KD: Number(cs2GeneralStats.lifetime['Average K/D Ratio']),
                    eloToRankDown: this.calculationService.getEloToUpOrDown(GameIDEnum.CS2, faceitPlayer.games.cs2.skill_level, faceitPlayer.games.cs2.faceit_elo, 'down'),
                    eloToRankUp: this.calculationService.getEloToUpOrDown(GameIDEnum.CS2, faceitPlayer.games.cs2.skill_level, faceitPlayer.games.cs2.faceit_elo, 'up'),
                    matchesCount: Number(cs2GeneralStats.lifetime.Matches),
                    winRate: Number(cs2GeneralStats.lifetime['Win Rate %']),
                    regionPosition: cs2RegionPosition.position,
                    countryPosition: cs2CountryPosition.position,
                    region: faceitPlayer.games.cs2.region,
                },
                lastMatches: this.calculationService.getLastMatchesStatistic(cs2LastMatchesStats, cs2EloApplies),
            } : null,
            'cs:go': csgoGeneralStats ? {
                general: {
                    lvl: faceitPlayer.games.csgo.skill_level,
                    elo: faceitPlayer.games.csgo.faceit_elo,
                    KD: Number(csgoGeneralStats.lifetime['Average K/D Ratio']),
                    eloToRankDown: this.calculationService.getEloToUpOrDown(GameIDEnum.CSGO, faceitPlayer.games.csgo.skill_level, faceitPlayer.games.csgo.faceit_elo, 'down'),
                    eloToRankUp: this.calculationService.getEloToUpOrDown(GameIDEnum.CSGO, faceitPlayer.games.csgo.skill_level, faceitPlayer.games.csgo.faceit_elo, 'up'),
                    matchesCount: Number(csgoGeneralStats.lifetime.Matches),
                    winRate: Number(csgoGeneralStats.lifetime['Win Rate %']),
                    regionPosition: csgoRegionPosition.position,
                    countryPosition: csgoCountryPosition.position,
                    region: faceitPlayer.games.csgo.region,
                },
                lastMatches: this.calculationService.getLastMatchesStatistic(csgoLastMatchesStats, csgoEloApplies),
            } : null,
        } as PlayerStatsDetailSchema;
    }
}
