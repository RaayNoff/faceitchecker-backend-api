export class PlayerStatsDetailSchema {
    faceitName: string;

    faceitUrl: string;

    steamName: string;

    steamUrl: string;

    profilePictureUrl: string;

    country: string;

    cs2: {
        general: {
            lvl: number,
            elo: number,
            KD: number,
            eloToRankDown: number,
            eloToRankUp: number,
            matchesCount: number,
            winRate: number,
            countryPosition: number,
            regionPosition: number,
            region: string,
        },
        lastMatches: {
            winsCount: number,
            losesCount: number,
            winRate: number,
            eloDifference: number,

            avgKills: number,
            avgDeaths: number,
            avgKD: number,
            avgKR: number,
            avgHS: number,

            'KDRatioBelow.5': number,
            'KDRatioBetween.5and1': number,
            'KDRatioAbove1': number,
        },
    } | null;

    'cs:go': {
        general: {
            lvl: number,
            elo: number,
            KD: number,
            eloToRankDown: number,
            eloToRankUp: number,
            matchesCount: number,
            winRate: number,
            countryPosition: number,
            regionPosition: number,
            region: string,
        },
        lastMatches: {
            winsCount: number,
            losesCount: number,
            winRate: number,
            eloDifference: number,

            avgKills: number,
            avgDeaths: number,
            avgKD: number,
            avgKR: number,
            avgHS: number,

            'KDRatioBelow.5': number,
            'KDRatioBetween.5and1': number,
            'KDRatioAbove1': number,
        },
    } | null;
}
