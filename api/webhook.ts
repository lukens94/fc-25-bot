import { VercelRequest, VercelResponse } from "@vercel/node";
import bot from "../src/bot";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        await bot.init(); // 🔥 Inizializza il bot qui per sicurezza
        await bot.handleUpdate(req.body);
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
