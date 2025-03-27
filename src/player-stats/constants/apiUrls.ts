export const FACEIT_PLAYER_DETAILS = 'https://open.faceit.com/data/v4/players';
export const FACEIT_GENERAL_GAME_STATS = (
    playerId: string,
    gameId: string,
) => `https://open.faceit.com/data/v4/players/${playerId}/stats/${gameId}`;
export const FACEIT_MATCHES_STATS = (
    playerId: string,
    gameId: string,
) => `https://open.faceit.com/data/v4/players/${playerId}/games/${gameId}/stats`;
export const FACEIT_ELO_APPLIES = (
    playerId: string,
    gameId: string,
) => `https://www.faceit.com/api/stats/v1/stats/time/users/${playerId}/games/${gameId}`;

export const FACEIT_REGION_POSITION = (
    playerId: string,
    gameId: string,
    region: string,
) => `https://open.faceit.com/data/v4/rankings/games/${gameId}/regions/${region.toUpperCase()}/players/${playerId}`

export const FACEIT_COUNTRY_POSITION = (
    playerId: string,
    gameId: string,
    region: string,
    country: string
) => `https://open.faceit.com/data/v4/rankings/games/${gameId}/regions/${region.toUpperCase()}/players/${playerId}?country=${country.toLowerCase()}`
