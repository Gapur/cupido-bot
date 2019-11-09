const Telegraf = require('telegraf');
const Markup = require("telegraf/markup");
const Stage = require("telegraf/stage");
const session = require("telegraf/session");
const WizardScene = require("telegraf/scenes/wizard");

const loveCalculator = require("./api/loveCalculator");

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start(ctx => {
  ctx.reply(
    `Hello ${ctx.from.first_name}, would you like to know the love compatibility?`,
    Markup.inlineKeyboard([
      Markup.callbackButton("Love Calculate", "LOVE_CALCULATE")
    ]).extra()
  );
});

const loveCalculate = new WizardScene(
  "love_calculate",
  ctx => {
    ctx.reply("Please, type in your name");
    return ctx.wizard.next();
  },
  ctx => {
    ctx.wizard.state.yourName = ctx.message.text;
    ctx.reply(
      "Enter the name of your partner/lover/crush to find Love compatibility & chances of successful love relationship."
    );
    return ctx.wizard.next();
  },
  ctx => {
    const partnerName = ctx.message.text;
    const yourName = ctx.wizard.state.yourName;
    loveCalculator
      .getPercentage(yourName, partnerName)
      .then(res => {
        const { fname, sname, percentage, result } = res.data;
        ctx.reply(
          `${fname} + ${sname} = ${percentage}% \n ${result}`,
          Markup.inlineKeyboard([
            Markup.callbackButton(
              "💱 calculate Another Relationship",
              "LOVE_CALCULATE"
            )
          ]).extra()
        );
      })
      .catch(err => {
        ctx.reply(
          err.message,
          Markup.inlineKeyboard([
            Markup.callbackButton("calculate again", "LOVE_CALCULATE")
          ]).extra()
        );
      });
    return ctx.scene.leave();
  }
);

const stage = new Stage([loveCalculate], { default: "love_calculate" });
bot.use(session());
bot.use(stage.middleware());
bot.launch();
