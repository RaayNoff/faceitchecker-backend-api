export interface IEloApplies {
    readonly _id:           ID;
    readonly created_at:    number;
    readonly updated_at:    number;
    readonly i10:           string;
    readonly i13:           string;
    readonly i15:           string;
    readonly i14:           string;
    readonly i16:           string;
    readonly nickname:      "RaayNoff";
    readonly playerId:      string;
    readonly i40:           string;
    readonly i6:            string;
    readonly i7:            string;
    readonly i8:            string;
    readonly i9:            string;
    readonly c10:           string;
    readonly c2:            string;
    readonly c3:            string;
    readonly c4:            string;
    readonly c1:            string;
    readonly i19:           string;
    readonly teamId:        string;
    readonly i3:            string;
    readonly i4:            string;
    readonly i5:            string;
    readonly premade:       boolean;
    readonly c5:            string;
    readonly bestOf:        string;
    readonly competitionId: string;
    readonly date:          number;
    readonly game:          "cs2";
    readonly gameMode:      "5v5";
    readonly i0:            "EU";
    readonly i1:            I1;
    readonly i12:           string;
    readonly i18:           string;
    readonly i2:            string;
    readonly matchId:       string;
    readonly matchRound:    string;
    readonly played:        string;
    readonly status:        "APPLIED";
    readonly elo:           string;
}

export interface ID {
    readonly matchId:  string;
    readonly playerId: string;
}

export type I1 = "de_dust2" | "de_ancient" | "de_mirage" | "de_anubis" | "de_nuke";
