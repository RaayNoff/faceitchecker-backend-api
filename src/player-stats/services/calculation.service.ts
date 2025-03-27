import { Injectable } from '@nestjs/common';
import { ILastMatchesStats } from '../interfaces/ILastMatchesStats';
import { IEloApplies } from '../interfaces/IEloApplies';
import { GameIDEnum } from '../enums/GameIDEnum';

@Injectable()
export class CalculationService {

    SKILL_LEVELS_BY_GAME = {
        csgo: {
            1: [1, 800],
            2: [801, 950],
            3: [951, 1100],
            4: [1101, 1250],
            5: [1251, 1400],
            6: [1401, 1550],
            7: [1551, 1700],
            8: [1701, 1850],
            9: [1851, 2000],
            10: [2001, null],
        },
        cs2: {
            1: [1, 500],
            2: [501, 750],
            3: [751, 900],
            4: [901, 1050],
            5: [1051, 1200],
            6: [1201, 1350],
            7: [1351, 1530],
            8: [1531, 1750],
            9: [1751, 2000],
            10: [2001, null],
        },
    };

    constructor() {
    }


    public getLastMatchesStatistic(
        lastMatchesStatistic: ILastMatchesStats,
        eloAppliedForMatches: IEloApplies[],
    ) {
        const aggregatedStats = lastMatchesStatistic.items.reduce((acc, item) => {
            const result = Number(item.stats['Result']);
            const kills = Number(item.stats['Kills']);
            const deaths = Number(item.stats['Deaths']);
            const kd = Number(item.stats['K/D Ratio']);
            const kr = Number(item.stats['K/R Ratio']);
            const hs = Number(item.stats['Headshots %']);

            acc.wins += result;
            acc.loses += result === 0 ? 1 : 0;
            acc.kills += kills;
            acc.deaths += deaths;
            acc.kd += kd;
            acc.kr += kr;
            acc.hs += hs;

            if (kd <= 0.5) {
                acc.kdBelow_5 += kills;
            } else if (kd < 1) {
                acc.kdBetween_5_1 += kills;
            } else {
                acc.kdAbove_1 += kills;
            }

            return acc;
        }, {
            wins: 0, loses: 0, kills: 0, deaths: 0, kd: 0, kr: 0, hs: 0, kdBelow_5: 0, kdBetween_5_1: 0, kdAbove_1: 0,
        });

        const matchesCount = lastMatchesStatistic.items.length;
        return {
            winsCount: aggregatedStats.wins,
            losesCount: aggregatedStats.loses,
            winRate: (aggregatedStats.wins / matchesCount) * 100,
            eloDifference: Number(eloAppliedForMatches[0]?.elo) - Number(eloAppliedForMatches.at(-1)?.elo),
            avgKills: (aggregatedStats.kills / matchesCount).toFixed(2),
            avgDeaths: (aggregatedStats.deaths / matchesCount).toFixed(2),
            avgKD: (aggregatedStats.kd / matchesCount).toFixed(2),
            avgKR: (aggregatedStats.kr / matchesCount).toFixed(2),
            avgHS: (aggregatedStats.hs / matchesCount).toFixed(2),
            'KDRatioBelow.5': (aggregatedStats.kdBelow_5 / matchesCount).toFixed(2),
            'KDRatioBetween.5and1': (aggregatedStats.kdBetween_5_1 / matchesCount).toFixed(2),
            'KDRatioAbove1': (aggregatedStats.kdAbove_1 / matchesCount).toFixed(2),
        };
    }

    public getEloToUpOrDown(game: GameIDEnum, lvl: number, currentElo: number, type: 'up' | 'down') {
        const [lowEdge, upEdge] = this.SKILL_LEVELS_BY_GAME[game][lvl];

        return type === 'up'
            ? upEdge <= currentElo
                ? 0
                : upEdge - currentElo
            : currentElo - lowEdge
    }
}
