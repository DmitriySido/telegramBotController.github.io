const express = require('express');
const { exec } = require('child_process');
const os = require('os');
const si = require('systeminformation');

const app = express();
const port = 4000;

function openForzaHorizon5() {
  const gamePath = 'G:\\SteamLibrary\\steamapps\\common\\ForzaHorizon5';
  exec(`start "" "${gamePath}\\ForzaHorizon5.exe"`);
}

function openMusic() {
  const musicPath = 'C:\\Users\\Sidoorenko\\Music\\Big_Baby_Tape_kizaru_-_Big_Tymers_(musmore.com).mp3';
  exec(`start "" "${musicPath}"`);
}

// Открытие списка с действиями
app.get('/action_list', (req, res) => res.send('Действие успешно выполнено'));

// Закрытие списка с действиями
app.get('/close_menu', (req, res) => res.send('Меню закрыто'));

// Включить музыку
app.get('/music', (req, res) => {
  openMusic();
  res.send('Врубаю музыку.');
});

// Открыть Google
app.get('/open_google', (req, res) => {
  exec('start http://www.google.com', (error) => {
    if (error) {
      res.status(500).send('Произошла ошибка при попытке открыть Google.');
    } else {
      res.send('Google открыт.');
    }
  });
});

// Открыть Chat GPT
app.get('/open_gpt', (req, res) => {
  exec('start https://chatgpt.com/', (error) => {
    if (error) {
      res.status(500).send('Произошла ошибка при попытке открыть GPT.');
    } else {
      res.send('GPT чат открыт.');
    }
  });
});

// Открыть Spotify
app.get('/open_spotify', (req, res) => {
  exec('start https://open.spotify.com/', (error) => {
    if (error) {
      res.status(500).send('Произошла ошибка при попытке открыть Spotify.');
    } else {
      res.send('Spotify открыт.');
    }
  });
});

// Открыть YouTube
app.get('/open_youtube', (req, res) => {
  exec('start https://m.youtube.com/', (error) => {
    if (error) {
      res.status(500).send('Произошла ошибка при попытке открыть YouTube.');
    } else {
      res.send('YouTube открыт.');
    }
  });
});

// Открыть Forza Horizon 5
app.get('/open_forza5', (req, res) => {
  openForzaHorizon5();
  res.send('Открываю игру Forza Horizon 5...');
});

// Получить данные о системе
app.get('/system_info', async (req, res) => {
  try {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const gpuData = await si.graphics();
    
    if (gpuData.controllers.length === 0) {
      throw new Error('Нет данных о GPU.');
    }
    
    const gpu = gpuData.controllers[0];
    const info = `Всего памяти: ${Math.round((totalMem - 1000000000) / 1000000000)} GB\n
Доступно памяти: ${Math.round(freeMem / 1000000000)} GB\n
Видеокарта: ${gpu.model}\n
Загруженность видеокарты: ${(gpu.memoryUsed / gpu.memoryTotal * 100).toFixed(2)}%\n
Температура видеокарты: ${gpu.temperatureGpu}°C\n`;
    
    res.send(info);
  } catch (error) {
    console.error(`Ошибка при получении данных о системе: ${error.message}`);
    res.status(500).send(`Ошибка при получении данных о системе: ${error.message}`);
  }
});

app.listen(port, () =>console.log(`Сервер запущен: http://localhost:${port}`));
