const TelegramAPI = require('node-telegram-bot-api');
const axios = require('axios');


const token = '7438547813:AAH9c90rg62f-YXDZLXvwGlQQYWTQjar-As';
const bot = new TelegramAPI(token, {polling: true});

const screenshot = require('screenshot-desktop');
const fs = require('fs');

const { error } = require('console');


bot.setMyCommands([
  { command: '/open_google', description: 'Открыть Google 🤖' },
  { command: '/open_spotify', description: 'Открыть Spotify 🎶' },
  { command: '/open_youtube', description: 'Открыть YouTube 👀'},
  { command: '/open_forza5', description: 'Открыть ForzaHorizon5 ❤'},
  { command: '/open_gpt', description: 'Открыть GPT чат 👻'},
  { command: '/screenshot', description: 'Сделать скриншот экрана 📸' },
  { command: '/system_info', description: 'Получить информацию о системе 🖥️' },
  { command: '/music', description: 'Включить Kizzaru ' },

  { command: '/start', description: 'Запустить бота' },
]);


const errorText = 'Произошла ошибка при попытке открыть'


bot.on('message', (msg) => {
  const text = msg.text;
  const chatID = msg.chat.id;

  switch (text) {
    case '/open_google':
      axios.get('http://localhost:4000/open_google')
        .then(() => bot.sendMessage(chatID, 'Google открыт.'))
        .catch(() => bot.sendMessage(chatID, `${errorText} Google.`));
      break;

    case '/open_gpt':
      axios.get('http://localhost:4000/open_gpt')
        .then(() => bot.sendMessage(chatID, 'GPT открыт.'))
        .catch(() => bot.sendMessage(chatID, `${errorText} GPT.`));
      break;

    case '/open_spotify':
      axios.get('http://localhost:4000/open_spotify')
        .then(() => bot.sendMessage(chatID, 'Spotify открыт.'))
        .catch(() => bot.sendMessage(chatID, `${errorText} Spotify.`));
      break;

    case '/open_youtube':
      axios.get('http://localhost:4000/open_youtube')
        .then(() => bot.sendMessage(chatID, 'YouTube открыт.'))
        .catch(() => bot.sendMessage(chatID, `${errorText} YouTube.`));
      break;

    case '/open_forza5':
      axios.get('http://localhost:4000/open_forza5')
        .then(() => bot.sendMessage(chatID, 'Forza Horizon 5 открытa.'))
        .catch(() => bot.sendMessage(chatID, `${errorText} Forza Horizon 5.`));
      break;

      case '/music':
      axios.get('http://localhost:4000/music')
        .then(() => bot.sendMessage(chatID, 'Музыка включена'))
        .catch(() => bot.sendMessage(chatID, `${errorText} музыку.`));
      break;

      case '/screenshot':
        screenshot({ format: 'png' }).then((img) => {
          const filePath = './screenshot.png';
          fs.writeFileSync(filePath, img);
          bot.sendPhoto(chatID, filePath)
            .then(() => fs.unlinkSync(filePath)) // Удаляем сделаный скриншот
            .catch(error => bot.sendMessage(chatID, `Ошибка при отправке скриншота: ${error.message}`));
        }).catch((error) => bot.sendMessage(chatID, `Ошибка при создании скриншота: ${error.message}`));
        break;

      case '/system_info':
        axios.get('http://localhost:4000/system_info')
        .then(response => bot.sendMessage(chatID, response.data))
        .catch(error => bot.sendMessage(chatID, `Ошибка при получении информации о системе: ${error.message}`));
      break;

    case '/start':
      bot.sendMessage(chatID, 'Привет😀 я был создан для автоматизации твоего ПК, используй нужные тебе команды чтобы увидеть меня в деле😜');
    break;

    default:
      bot.sendMessage(chatID, 'Такой команды я не знаю!');
    break;
  }
});