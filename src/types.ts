export type ResultMatch = {
    team: Player[];
    winner: boolean;
    draw: boolean;
}

export type Player = {
    username: string;
    id: string;
}