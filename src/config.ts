import dotenv from "dotenv";
import {Bot, Context} from "grammy";
import {ParseModeFlavor} from "@grammyjs/parse-mode";

dotenv.config();

export const config = {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN as string,
    SUPABASE_URL: process.env.SUPABASE_URL as string,
    SUPABASE_KEY: process.env.SUPABASE_KEY as string,
    VERCEL_URL: process.env.VERCEL_URL as string,
};

export const bot = new Bot<ParseModeFlavor<Context>>(config.TELEGRAM_BOT_TOKEN);

