const TelegramAPI = require('node-telegram-bot-api');
const axios = require('axios');


const token = 'YOUR_TELEGRAM_TOKEN_IN_BOT_FATHER';
const bot = new TelegramAPI(token, {polling: true});

const screenshot = require('screenshot-desktop');
const fs = require('fs');


bot.setMyCommands([
  { command: '/action_list', description: 'Список доступных действий' },
  { command: '/start', description: 'Запустить бота' },
]);


const errorText = 'Произошла ошибка при попытке открыть';

bot.on('message', async (msg) => {
  const text = msg.text;
  const chatID = msg.chat.id;

  switch (text) {
    case '/action_list':
      try {
        await axios.get('http://localhost:4000/action_list');
        await bot.sendMessage(chatID, 'Выберите действие:', {
          reply_markup: {
            keyboard: [
              [{ text: 'Скриншот 📸' }, { text: 'Информация o системе 🖥️' }],
              [{ text: 'Открыть Google 🤖' }, { text: 'Открыть Spotify 🎶' }],
              [{ text: 'Открыть YouTube 👀' }, { text: 'Открыть GPT чат 👻' }],
              [{ text: 'Включить Kizzaru 🎶' }, { text: 'Открыть ForzaHorizon5 ❤' }],
              [{ text: 'Закрыть меню ❌' }]
            ],
            resize_keyboard: true,
            one_time_keyboard: false
          }
        });
      } catch (error) {
        await bot.sendMessage(chatID, 'Меню сейчас не доступно!');
      }
      break;

      case 'Закрыть меню ❌':
        try {
          await axios.get('http://localhost:4000/close_menu');
          await bot.sendMessage(msg.chat.id, 'Меню закрыто', {
            reply_markup: {
              remove_keyboard: true
            }
          });
        } catch (error) {
          bot.sendMessage(msg.chat.id, 'Ошибка при попытке закрыть меню.');
        }
      break;

    case 'Открыть Google 🤖':
      try {
        await axios.get('http://localhost:4000/open_google');
        await bot.sendMessage(chatID, 'Google открыт.');
      } catch (error) {
        await bot.sendMessage(chatID, `${errorText} Google.`);
      }
    break;

    case 'Открыть GPT чат 👻':
      try {
        await axios.get('http://localhost:4000/open_gpt');
        await bot.sendMessage(chatID, 'GPT открыт.');
      } catch (error) {
        await bot.sendMessage(chatID, `${errorText} GPT.`);
      }
    break;

    case 'Открыть Spotify 🎶':
      try {
        await axios.get('http://localhost:4000/open_spotify');
        await bot.sendMessage(chatID, 'Spotify открыт.');
      } catch (error) {
        await bot.sendMessage(chatID, `${errorText} Spotify.`);
      }
    break;

    case 'Открыть YouTube 👀':
      try {
        await axios.get('http://localhost:4000/open_youtube');
        await bot.sendMessage(chatID, 'YouTube открыт.');
      } catch (error) {
        await bot.sendMessage(chatID, `${errorText} YouTube.`);
      }
    break;

    case 'Открыть ForzaHorizon5 ❤':
      try {
        await axios.get('http://localhost:4000/open_forza5');
        await bot.sendMessage(chatID, 'Forza Horizon 5 открыта.');
      } catch (error) {
        await bot.sendMessage(chatID, `${errorText} Forza Horizon 5.`);
      }
    break;

    case 'Включить Kizzaru 🎶':
      try {
        await axios.get('http://localhost:4000/music');
        await bot.sendMessage(chatID, 'Музыка включена');
      } catch (error) {
        await bot.sendMessage(chatID, `${errorText} музыку.`);
      }
    break;

    case 'Скриншот 📸':
      try {
        const img = await screenshot({ format: 'png' });
        const filePath = './screenshot.png';
        fs.writeFileSync(filePath, img);
        await bot.sendPhoto(chatID, filePath);
        fs.unlinkSync(filePath); // Удаляем сделанный скриншот
      } catch (error) {
        await bot.sendMessage(chatID, `Ошибка: ${error.message}`);
      }
    break;

    case 'Информация o системе 🖥️':
      try {
        const response = await axios.get('http://localhost:4000/system_info');
        await bot.sendMessage(chatID, response.data);
      } catch (error) {
        await bot.sendMessage(chatID, `Ошибка при получении информации о системе: ${error.message}`);
      }
    break;

    case '/start':
      await bot.sendMessage(chatID, 'Привет😀 я был создан для автоматизации твоего ПК, используй нужные тебе команды чтобы увидеть меня в деле😜');
    break;

    default:
      await bot.sendMessage(chatID, 'Такой команды я не знаю!');
    break;
  }
});
