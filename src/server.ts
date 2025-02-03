import bot from "./bot";

(async () => {
    console.log("🤖 Bot avviato in modalità polling...");
    await bot.start();
})();
