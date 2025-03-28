export interface IPosition {
    readonly position: number,
    readonly items: Item[],
    readonly start: number,
    readonly end: number,
}

export interface Item {
    readonly player_id: string,
    readonly nickname: string,
    readonly country: 'ru',
    readonly position: number,
    readonly faceit_elo: number,
    readonly game_skill_level: number,
}
