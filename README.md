<p align="center">
  <img width="680"src="https://github.com/Gapur/cupido-bot/blob/master/images/bot-father.png">
</p>

# cupido-bot

Love Calculator Telegram Bot with Node.js

Since Telegram Bot has appeared, I always interested in how they work. So I decided to build simple Telegram Bot with Node.js and Telegraf. Telegraf is a modern bot framework for Node.js.

## Create own Bot with BotFather

First, We should create own bot with BotFather. BotFather is the one bot to rule them all. We will use it to create new bot accounts and manage your existing bots.

If you open a chat with a BotFather, click on the “Start” button:

<p align="center">
  <img width="680"src="https://github.com/Gapur/cupido-bot/blob/master/images/start.png">
</p>

We should create a new bot by clicking /newbot command. Next, you should enter any name for the bot. I named Cupido 

## Setting up the Project

Install and run the project:

1. Clone this repo:
```
git clone https://github.com/Gapur/cupido-bot.git
```

2. Install dependencies:
```
npm install
```

3. Launch project:
```
node index.js
```

## Write bot’s code

We can create bot by the following code lines:
```js
const Telegraf = require('telegraf') // import telegram lib

const bot = new Telegraf(process.env.BOT_TOKEN) // get the token from envirenment variable
bot.start((ctx) => ctx.reply('Welcome')) // display Welcome text when we start bot
bot.hears('hi', (ctx) => ctx.reply('Hey there')) // listen and handle when user type hi text
bot.launch() // start
```

<p align="center">
  <img width="680"src="https://github.com/Gapur/cupido-bot/blob/master/images/two-step.png">
</p>

We can change bot’s icon by /mybots command.

<p align="center">
  <img width="680"src="https://github.com/Gapur/cupido-bot/blob/master/images/image.png">
</p>

Let's create loveCalculator.js to work with api:
```js

const axios = require("axios");

const BASE_URL = "https://love-calculator.p.rapidapi.com";

module.exports = {
  getPercentage: (yourName, partnerName) => axios({
      "method": "GET",
      "url": `${BASE_URL}/getPercentage`,
      "headers": {
        "content-type": "application/octet-stream",
        "x-rapidapi-host": "love-calculator.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPID_API_KEY
      },
      "params": {
        "fname": yourName,
        "sname": partnerName
        }
      })
};
```

I used stage from telegraf to implement a two-step conversation between user and bot. Stage is a simple scene-based control flow middleware.
```js
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

// love calculator two-step wizard
const loveCalculate = new WizardScene(
  "love_calculate",
  ctx => {
    ctx.reply("Please, enter your name"); // enter your name
    return ctx.wizard.next();
  },
  ctx => {
    ctx.wizard.state.yourName = ctx.message.text; // store yourName in the state to share data between middlewares
    ctx.reply(
      "Enter the name of your partner/lover/crush to find Love compatibility & chances of successful love relationship."
    );
    return ctx.wizard.next();
  },
  ctx => {
    const partnerName = ctx.message.text; // retrieve partner name from the message which user entered
    const yourName = ctx.wizard.state.yourName; // retrieve your name from state
    loveCalculator
      .getPercentage(yourName, partnerName)
      .then(res => {
        const { fname, sname, percentage, result } = res.data;
        ctx.reply(
          `${fname} + ${sname} = ${percentage}% \n ${percentage > 50 ? '☺️' : '😢'} ${result}`,
          Markup.inlineKeyboard([
            Markup.callbackButton(
              "♥️ calculate Another Relationship",
              "LOVE_CALCULATE"
            )
          ]).extra()
        );
      })
      .catch(err => ctx.reply(
        err.message,
        Markup.inlineKeyboard([
          Markup.callbackButton("calculate again", "LOVE_CALCULATE")
        ]).extra()
      ));
    return ctx.scene.leave();
  }
);

const stage = new Stage([loveCalculate], { default: "love_calculate" }); // Scene registration
bot.use(session());
bot.use(stage.middleware());
bot.launch();
```

## Our Telegram Bot

<p align="center">
  <img width="680"src="https://github.com/Gapur/cupido-bot/blob/master/images/bot.png">
</p>

## Article on Medium

[Build own Telegram Bot with Node.js](https://medium.com/@gapur.kassym/build-own-telegram-bot-with-node-js-516b8f233585)

## How to contribute?

1. Fork this repo
2. Clone your fork
3. Code 🤓
4. Test your changes
5. Submit a PR!
