import {escapeMarkdown, getUsers} from "../utils";
import {GoogleTranslator} from "@translate-tools/core/translators/GoogleTranslator";
import {sendMessage} from "./send_message";

export const sendShit = async(chatId: number) => {
    const translator = new GoogleTranslator();
    const users = await getUsers();

    const numberOfUsers = users.length;
    const {tag_name: randomTag} = users[Math.floor(Math.random() * numberOfUsers)];

    const insult = await fetch("https://evilinsult.com/generate_insult.php?lang=en&type=json")
        .then((res) => res.json())
        .then((data) => data.insult)
        .catch((err) => {
            console.error(err);
            return "Errore nell'ottenere l'insulto";
        });

    const translatedInsult = await translator
        .translate(insult, 'en', 'it')
        .then((translate) => translate)
        .catch((err) => {
            console.error(err);
            return "Errore nella traduzione";
        });

    const message = `Ciao ${randomTag}, ${translatedInsult}`;

    await sendMessage(chatId, escapeMarkdown(message));
}
