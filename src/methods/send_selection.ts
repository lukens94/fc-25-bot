import {bot} from "../config";
import type {Context} from "grammy";
import {getUsers} from "../utils";
import {sendMessage} from "./send_message";
import type {Player, ResultMatch} from "../types";
import {insertMatch} from "./insert_match";

const selectedUsers: Set<string> = new Set();
let team1: Player[] = [];
let team2: Player[] = [];
let result: string | null = null;

export const sendPlayerSelectionKeyboard = async (chatId: number) => {
    selectedUsers.clear();
    const users = await getUsers();

    const rows = users.map((user) => {
        return [{
            text: `${user.username}`,
            callback_data: `select_${user.id}`,
        }];
    });

    rows.push([{
        text: 'Invia selezione ⚽',
        callback_data: 'send_selection',
    }]);

    return await sendMessage(chatId, 'Seleziona un giocatore:', {inline_keyboard: rows});
};

bot.on('callback_query', async (ctx: Context) => {
    const callbackData = ctx.update.callback_query?.data!;
    const chatId = ctx.callbackQuery?.message?.chat.id!;
    const usersMessageId = ctx.callbackQuery?.message?.message_id!;
    const users = await getUsers();

    const match = callbackData.match(/^select_([\w-]+)$/);
    if (match) {
        const userId = match[1];

        if (selectedUsers.has(userId)) {
            selectedUsers.delete(userId);
        } else {
            selectedUsers.add(userId);
        }

        team1 = [];
        team2 = [];
        Array.from(selectedUsers).forEach((userId, index) => {
            const user = users.find(u => u.id === userId);
            if (index % 2 === 0) {
                team1.push({username: user?.username || "", id: user?.id || ""});
            } else {
                team2.push({username: user?.username || "", id: user?.id || ""});
            }
        });

        const updatedKeyboard = users.map((user) => {
            const isSelected = selectedUsers.has(user.id);
            const teamColor = team1.some(u => u.id === user.id) ? '🟢' : team2.some(u => u.id === user.id) ? '🔴' : '';

            return [{
                text: `${isSelected ? teamColor : ""} ${user.username}`,
                callback_data: `select_${user.id}`,
            }];
        });

        updatedKeyboard.push([{
            text: 'Invia selezione ⚽',
            callback_data: 'send_selection',
        }]);

        await bot.api.editMessageReplyMarkup(chatId, usersMessageId, {
            reply_markup: {
                inline_keyboard: updatedKeyboard,
            },
        });
    }

    if (callbackData === 'send_selection') {
        const selectedUsernames = Array.from(selectedUsers)
            .map(userId => {
                const user = users.find(u => u.id === userId);
                return user ? user.username : null;
            })
            .filter(username => username !== null)
            .join(', ');

        const totalSelectedUsers = Array.from(selectedUsers).length

        if (totalSelectedUsers > 4) {
            await sendMessage(chatId, "Seleziona al massimo 4 giocatori");
            await ctx.answerCallbackQuery();
            return;
        }

        if (totalSelectedUsers % 2 !== 0) {
            await sendMessage(chatId, "Seleziona un numero pari di giocatori");
            await ctx.answerCallbackQuery();
            return;
        }

        const teamMessage = `Seleziona il risultato della partita:\n\n`+
        `🟢 Squadra 1:\n\\- ${team1.map(player => `${player.username}`).join(', ')}\n\n`+
        `🔴 Squadra 2:\n\\- ${team2.map(player => `${player.username}`).join(', ')}\n`;

        const resultRows = [
            [{text: 'Squadra 1 vince 🟢', callback_data: 'result_1',}],
            [{text: 'Squadra 2 vince 🔴', callback_data: 'result_2',}],
            [{text: 'Pareggio 🤝', callback_data: 'result_draw',}],
            [{ text: 'Annulla 🚫', callback_data: 'cancel_selection' }],
        ];

        await sendMessage(chatId, teamMessage, {inline_keyboard: resultRows});
        await bot.api.deleteMessage(chatId, usersMessageId);

        await ctx.answerCallbackQuery();
    }

    if (callbackData === 'cancel_selection') {
        selectedUsers.clear();
        team1 = [];
        team2 = [];
        result = null;

        await bot.api.deleteMessage(chatId, usersMessageId);
        await ctx.answerCallbackQuery({
            text: "Selezione annullata.",
            show_alert: false,
        });
    }

    if (callbackData.startsWith('result_')) {
        let winner: boolean = false;
        let draw: boolean = false;

        if (callbackData === 'result_1') {
            result = 'Squadra 1 vince 🏆';
            winner = true;
        } else if (callbackData === 'result_2') {
            result = 'Squadra 2 vince 🏆';
            winner = false;
        } else if (callbackData === 'result_draw') {
            result = 'Pareggio 🤝';
            winner = false;
            draw = true;
        }

        const resultMessage = `Risultato: ${result}\n\n`+
        `🟢 Squadra 1:\n- ${team1.map(player => `${player.username}`).join(', ')}\n\n`+
        `🔴 Squadra 2:\n- ${team2.map(player => `${player.username}`).join(', ')}\n`;

        await bot.api.deleteMessage(chatId, usersMessageId);
        await ctx.answerCallbackQuery({
            text: resultMessage,
            show_alert: true,
        });
        const resultData: ResultMatch[] = [
            {
                team: team1,
                winner: winner && !draw,
                draw: draw,
            },
            {
                team: team2,
                winner: !winner && !draw,
                draw: draw,
            },
        ];

        await insertMatch(resultData);
    } else {
        await ctx.answerCallbackQuery();
    }
});
