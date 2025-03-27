export interface ILastMatchesStats {
    readonly items: Item[];
    readonly start: number;
    readonly end:   number;
}

export interface Item {
    readonly stats: Stats;
}

export interface Stats {
    readonly "Final Score":       string;
    readonly ADR:                 string;
    readonly "Match Round":       string;
    readonly "Overtime score":    string;
    readonly MVPs:                string;
    readonly Score:               string;
    readonly "Competition Id":    string;
    readonly Region:              "EU";
    readonly "Player Id":         string;
    readonly "Penta Kills":       string;
    readonly "Match Id":          string;
    readonly "First Half Score":  string;
    readonly "Updated At":        Date;
    readonly "K/D Ratio":         string;
    readonly "Double Kills":      string;
    readonly "Headshots %":       string;
    readonly "Game Mode":         "5v5";
    readonly Kills:               string;
    readonly "Best Of":           string;
    readonly Headshots:           string;
    readonly "Created At":        Date;
    readonly Rounds:              string;
    readonly Team:                string;
    readonly Assists:             string;
    readonly Result:              string;
    readonly Map:                 Map;
    readonly "Quadro Kills":      string;
    readonly "K/R Ratio":         string;
    readonly Nickname:            "RaayNoff";
    readonly "Triple Kills":      string;
    readonly "Second Half Score": string;
    readonly "Match Finished At": number;
    readonly Deaths:              string;
    readonly Game:                "cs2";
    readonly Winner:              string;
}

export type Map = "de_dust2" | "de_ancient" | "de_mirage" | "de_anubis" | "de_nuke";
