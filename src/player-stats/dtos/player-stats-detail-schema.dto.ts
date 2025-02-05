export class PlayerStatsDetailSchema {
    player_id: string;
    nickname: string;
    avatar: string;
    country: string;
    cover_image: string;
    cover_featured_image: string;
    infractions: {
        last_infraction_date: string | null;
        afk: number;
        leaver: number;
        qbanned: number;
    };
    platforms: {
        steam?: string;
        xbox?: string;
        psn?: string;
    };
    games: Record<
        string,
        {
            skill_level: number;
            faceit_elo: number;
            game_player_id: string;
            region: string;
            game_player_name: string;
        }
    >;
    settings: {
        language: string;
    };
    friends_ids: string[];
    bans: {
        is_banned: boolean;
        banned_until: string | null;
    };
    faceit_url: string;
}
