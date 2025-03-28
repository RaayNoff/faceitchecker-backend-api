export interface IGeneralGameStats {
    readonly player_id: string,
    readonly game_id: string,
    readonly lifetime: ILifetime,
    readonly segments: ISegment[],
}

interface ILifetime {
    readonly 'Longest Win Streak': string,
    readonly Matches: string,
    readonly 'K/D Ratio': string,
    readonly 'Average K/D Ratio': string,
    readonly 'Current Win Streak': string,
    readonly Wins: string,
    readonly 'Total Headshots %': string,
    readonly 'Win Rate %': string,
    readonly 'Average Headshots %': string,
    readonly 'Recent Results': string[],
}

interface ISegment {
    readonly type: 'Map',
    readonly mode: Mode,
    readonly label: string,
    readonly img_small: string,
    readonly img_regular: string,
    readonly stats: IStats,
}

type Mode = '5v5' | '1v1';

interface IStats {
    readonly 'Win Rate %': string,
    readonly 'Average Penta Kills': string,
    readonly 'K/D Ratio': string,
    readonly Kills: string,
    readonly 'Total Headshots %': string,
    readonly Assists: string,
    readonly 'Average Deaths': string,
    readonly 'Average K/D Ratio': string,
    readonly MVPs: string,
    readonly 'Headshots per Match': string,
    readonly 'Average Triple Kills': string,
    readonly Deaths: string,
    readonly 'Average Kills': string,
    readonly 'Penta Kills': string,
    readonly 'Average MVPs': string,
    readonly 'Average Headshots %': string,
    readonly Headshots: string,
    readonly Rounds: string,
    readonly Wins: string,
    readonly 'Average Assists': string,
    readonly 'Average Quadro Kills': string,
    readonly 'Quadro Kills': string,
    readonly Matches: string,
    readonly 'Triple Kills': string,
    readonly 'Average K/R Ratio': string,
    readonly 'K/R Ratio': string,
}
