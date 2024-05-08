const { Telegraf } = require("telegraf");
const TOKEN = process.env.BOT_TOKEN;
const bot = new Telegraf(TOKEN);

const web_link = "https://2048-new.vercel.app/";

bot.start((ctx) =>
    ctx.reply("Welcome..!!!!!!!!", {
        reply_markup: {
            keyboard: [[{ text: "web app", web_app: { url: web_link } }]],
        },
    })
);

bot.launch();

