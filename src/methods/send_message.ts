import { InlineKeyboardMarkup, Message,  } from "grammy/types";
import {bot} from "../config";
import {GrammyError} from "grammy";

export async function sendMessage(
    chatId: number,
    text: string,
    replyMarkup?: InlineKeyboardMarkup
) {
    try {
        return await bot.api.sendMessage(chatId, text, {
            parse_mode: 'MarkdownV2',
            reply_markup: replyMarkup,
        });
    } catch (error: unknown) {
        if (error instanceof GrammyError) {
            console.error("Errore di Grammy:", error.message);
            if (error.error_code === 400) {
                const newChatId = error.parameters?.migrate_to_chat_id;
                console.log(`Gruppo migrato! Nuovo chat_id: ${newChatId}`);
                if (newChatId) {
                    await bot.api.sendMessage(newChatId, text, {
                        parse_mode: 'MarkdownV2',
                        reply_markup: replyMarkup,
                    });
                }
            }
        } else {
            console.error("Errore sconosciuto:", error);
        }
    }
}
