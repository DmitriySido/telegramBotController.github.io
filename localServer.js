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
  const musicPath = 'C:\\Users\\Username\\Music\\music.mp3';
  exec(`start "" "${musicPath}"`);
}

// Открытие списка с действиями
app.get('/action_list', (res) => res.send('Действие успешно выполнено'));

// Закрытие списка с действиями
app.get('/close_menu', (res) => res.send('Меню закрыто'));

// Включить музыку
app.get('/music', (res) => {
  openMusic();
  res.send('Врубаю музыку.');
});

// Открыть Google
app.get('/open_google', (res) => {
  exec('start http://www.google.com', (error) => {
    error && res.status(500).send('Произошла ошибка при попытке открыть Google.');
    res.send('Google открыт.');
  });
});

// Открыть Chat GPT
app.get('/open_gpt', (res) => {
  exec('start https://chatgpt.com/', (error) => {
    error && res.status(500).send('Произошла ошибка при попытке открыть GPT.');
    res.send('GPT чат открыт.');
  });
});

// Открыть Spotify
app.get('/open_spotify', (res) => {
  exec('start https://open.spotify.com/', (error) => {
    error && res.status(500).send('Произошла ошибка при попытке открыть Spotify.');
    res.send('Spotify открыт.');
  });
});

// Открыть YouTube
app.get('/open_youtube', (res) => {
  exec('start https://m.youtube.com/', (error) => {
    error && res.status(500).send('Произошла ошибка при попытке открыть YouTube.');
    res.send('YouTube открыт.');
  });
});

// Открыть Forza Horizon 5
app.get('/open_forza5', (res) => {
  openForzaHorizon5();
  res.send('Открываю игру Forza Horizon 5...');
});

// Получить данные о системе
app.get('/system_info', async (res) => {
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
