import type {ResultMatch} from "../types";
import {supabase} from "../supabase";

export const insertMatch = async (resultData: ResultMatch[]) => {
    resultData.map(({team, winner, draw}) => {
        team.map(async ({username, id}) => {
            console.log(`${username} ha ${draw ? "pareggiato" : winner ? "vinto" : "perso"}`);
            const {data, error: fetchError} = await supabase
                .from('users')
                .select('win, lose, draw, points')
                .eq('id', id)
                .single();

            if (fetchError) {
                console.error('Errore nel recupero dei dati utente:', fetchError);
            }

            let updatedData = {
                win: winner ? data?.win + 1 : data?.win,
                lose: !winner ? data?.lose + 1 : data?.lose,
                draw: draw ? data?.draw + 1 : data?.draw,
                matches: 0,
                points: 0,
                efficiency: ""
            };

            updatedData.matches = updatedData.win + updatedData.lose + updatedData.draw;
            updatedData.points = updatedData.win * 3 + updatedData.draw;
            updatedData.efficiency = `${((updatedData.points / (updatedData.matches * 3)) * 100).toFixed(1).replace(".", ",")}%`;

            const {error} = await supabase
                .from('users')
                .upsert({id, ...updatedData})

            if (error) {
                console.error('Errore nell\'aggiornamento dei dati utente:', error);
            }

        })
    })
};
