import bot from "../bot";
import {GrammyError} from "grammy";

export const deleteCommandMessage = async (chatId: number, messageId: number) => {
    try {
        if (!chatId || !messageId) return;
        await bot.api.deleteMessage(chatId, messageId);
    } catch (error: unknown) {
        if (error instanceof GrammyError) {
            if (error.error_code === 400) {
                const newChatId = error.parameters?.migrate_to_chat_id;
                console.log(`Gruppo migrato! Nuovo chat_id: ${newChatId}`);
                if (!!newChatId && !!messageId) {
                    await bot.api.deleteMessage(newChatId, messageId);
                }
            }
        } else {
            console.error("Errore sconosciuto:", error);
        }
    }
};