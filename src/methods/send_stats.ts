import {supabase} from "../supabase";
import {escapeMarkdown, getPositionEmoji, STATS_MESSAGE} from "../utils";
import {sendMessage} from "./";

export async function sendStats(chatId: number) {
    const {data: data, error} = await supabase
        .from('users')
        .select('username, win, lose, draw, matches, points, efficiency')
        .order('points', {ascending: false})
        .order('efficiency', {ascending: false});

    if (error) {
        console.error('Errore nel recupero dei dati da Supabase:', error.message);
        return;
    }

    const stats = data.map(({ username, win, lose, draw, matches, points, efficiency }, index) => {
        const formattedText = `${getPositionEmoji(index)} *${username}*:\n\n` +
            `🏆 ${win} | ❌ ${lose} | 🤝 ${draw} | ⚽ ${matches}\n` +
            `🎯 *${points}* | 💎 *${efficiency || "-"}*\n` +
            `-------------------------\n\n`;

        return escapeMarkdown(formattedText);
    }).join('');

    const message = `${STATS_MESSAGE} ${stats}`
    await sendMessage(chatId, message);
}
