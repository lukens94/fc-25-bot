import type {Context} from "grammy";
import {bot} from "./config";
import {COMMANDS, getStrings, MY_USER_ID, WELCOME_TEXT} from "./utils";
import {
    sendMessage,
    sendStats,
    sendRanking,
    sendPlayerSelectionKeyboard,
    deleteCommandMessage,
    sendShit
} from "./methods";
import {hydrateReply} from "@grammyjs/parse-mode";

bot.use(hydrateReply);
(async () => {
    await bot.init();
})();


const handleCommand = async (ctx: Context, command: string) => {
    //const message = ctx.message?.text;
    const chatId = ctx.message?.chat.id;
    const messageId = ctx.message?.message_id;

    const strings = await getStrings();

    await deleteCommandMessage(chatId!, messageId!);

    switch (command) {
        case COMMANDS.START:
            await sendMessage(chatId!, WELCOME_TEXT);
            break;
        case COMMANDS.CLASSIFICA:
            console.log('Invio la classifica...');
            await sendRanking(chatId!);
            break;
        case COMMANDS.SALUTA:
            console.log('Invio il saluto...');
            await sendMessage(chatId!, strings["SECRET_MESSAGE"]);
            break;
        case COMMANDS.CHI_SONO:
            console.log('Ciao io sono...');
            await sendMessage(chatId!, strings["WHO_AM_I"]);
            break;
        case COMMANDS.STATISTICHE:
            console.log('Invio le statistiche...');
            await sendStats(chatId!);
            break;
        case COMMANDS.INSULTO:
            console.log('Invio insulto...');
            await sendShit(chatId!);
            break;
        case COMMANDS.INSERISCI:
            if (chatId === MY_USER_ID) {
                console.log('Il creatore ha eseguito /inserisci');
                await sendPlayerSelectionKeyboard(chatId);
            } else {
                await ctx.reply("⛔ Solo il tuo dio Luca Valenti può effettuare questa operazione.", {
                    disable_notification: true,
                });
            }
            break;
        default:
            console.log(`Comando non riconosciuto: ${command}`);
            break;
    }
};

Object.values(COMMANDS).forEach((command) => {
    bot.command(command, async (ctx) => {
        await handleCommand(ctx, command);
    });
});

export default bot;
