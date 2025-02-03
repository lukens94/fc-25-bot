import {supabase} from "../supabase";
import {sendMessage} from "./";
import {getPositionEmoji, RANKING_MESSAGE} from "../utils";

export async function sendRanking(chatId: number) {
    const {data, error} = await supabase
        .from('users')
        .select('username, points, efficiency')
        .order('points', {ascending: false})
        .order('efficiency', {ascending: false});

    if (error) {
        console.log('Errore durante il recupero dei dati:', error.message);
        await sendMessage(chatId, 'Errore nel recupero della classifica');
        return;
    }

    const ranking = data.map(({ username, points, efficiency }, index) => {
        return `*${getPositionEmoji(index)}* \\- ${username}\n   • 🎯 Punti: *${points}*\n   • 💎 Rendimento: *${efficiency || "\\-"}*`;
    }).join("\n\n");

    const message = `${RANKING_MESSAGE} ${ranking}`
    await sendMessage(chatId, message);
}
