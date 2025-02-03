import {supabase} from "../supabase";

export const escapeMarkdown = (text: string) => {
    return text
        .replace(/([_*[\]()~`>#+\-.!|])/g, '\\$1')
        .replace(/\\\*(.*?)\\\*/g, '*$1*');
};

export const getPositionEmoji = (index: number) => {
    switch (index) {
        case 0:
            return '🥇';
        case 1:
            return '🥈';
        case 2:
            return '🥉';
        default:
            return `${index + 1}️⃣`;
    }
}

export const getUsers = async (): Promise<{ id: string; username: string }[]> => {
    const { data, error } = await supabase
        .from('users')
        .select('id, username');

    if (error) {
        console.error("Errore nel recupero utenti da Supabase:", error);
        return [];
    }

    return data || [];
};

export const getStrings = async (): Promise<Record<string, string>> => {
    const { data, error } = await supabase
        .from('strings')
        .select('key, value');

    if (error) {
        console.error("Errore nel recupero utenti da Supabase:", error);
        return {};
    }

    return data.reduce((acc: Record<string, string>, { key, value }) => {
        acc[key] = value;
        return acc;
    }, {});
}

