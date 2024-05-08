const { Telegraf } = require("telegraf");
const TOKEN = "6286384554:AAE19TZVDoJ4kc9gjRhYCAYtkhrclusaHfE";
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

