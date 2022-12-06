const { Telegraf  } = require('telegraf')
const axios = require('axios');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const TOKEN = '5628922941:AAHibZzGLVFpG5ezw185_y-6h9gwLRePjf8';
const PROVIDER_TOKEN = '381764678:TEST:44896';
const webAppUrl = 'https://wpaka.uz/';
const bot = new Telegraf(TOKEN);

app.use(express.json());
app.use(cors());

const getInvoice = (id) => {
  const invoice = {
    chat_id: id,
    provider_token: PROVIDER_TOKEN,
    start_parameter: 'get_access',
    title: 'InvoiceTitle',
    description: 'InvoiceDescription',
    currency: 'RUB',
    prices: [{ label: 'Invoice Title', amount: 100 * 100 }],
    payload: {
      unique_id: `${id}_${Number(new Date())}`,
      provider_token: PROVIDER_TOKEN
    }
  }
  return invoice;
}

bot.hears('/start', (ctx) => {
  return ctx.telegram.sendMessage(ctx.message.chat.id, `Привет ${ctx.from.first_name}, заходи в наш интернет магазин`, {
    reply_markup: {
        inline_keyboard: [
            [{text: 'Сделать заказ', web_app: {url: webAppUrl}}]
        ]
    }
  })
});

bot.on('pre_checkout_query', (ctx) => {
    return ctx.answerPreCheckoutQuery(true)
})

bot.on('successful_payment', async (ctx, next) => {
  await ctx.reply(ctx.update.message.successful_payment)
})

app.post('/web-data', async (res) => {
  try {
      let result;
      axios.post(`https://api.telegram.org/bot5628922941:AAHibZzGLVFpG5ezw185_y-6h9gwLRePjf8/createInvoiceLink`, getInvoice(ctx.message.chat.id)).then(res => {
        result = res.data.result;
      })
      return res.status(200).json(result);
  } catch (e) {
      return res.status(500).json({
        error: 'Ошибка'
      })
  }
})

bot.launch()