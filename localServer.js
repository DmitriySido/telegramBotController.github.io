const express = require('express');
const { exec } = require('child_process');

const app = express();
const port = 4000;

const os = require('os');

const osUtils = require('os-utils');
const si = require('systeminformation');

// Функция для открытия игры Forza Horizon 5
function openForzaHorizon5() {
  const gamePath = 'G:\\SteamLibrary\\steamapps\\common\\ForzaHorizon5';
  exec(`start "" "${gamePath}\\ForzaHorizon5.exe"`);
}

// Функция для включения музыки с ПК
function openMusic() {
  const musicPath = 'C:\\Users\\Sidoorenko\\Music\\Big_Baby_Tape_kizaru_-_Big_Tymers_(musmore.com).mp3'; // Укажи путь к файлу
  exec(`start "" "${musicPath}"`);
}

app.get('/music', (res) => {
  openMusic();
  res.send('Врубаю музыку');
});

app.get('/open_google', res => {
  exec('start http://www.google.com', (error) => {
    if (error) {
      console.error(`exec error: ${error}`);
      res.status(500).send('Произошла ошибка при попытке открыть Google.');
      return;
    }
    res.send('Google открыт.');
  });
});

app.get('/open_gpt', res => {
  exec('start https://chatgpt.com/', (error) => {
    if (error) {
      console.error(`exec error: ${error}`);
      res.status(500).send('Произошла ошибка при попытке открыть GPT.');
      return;
    }
    res.send('GPT чат открыт.');
  });
});

app.get('/open_spotify', res => {
  exec('start https://open.spotify.com/', (error) => {
    if (error) {
      console.error(`exec error: ${error}`);
      res.status(500).send('Произошла ошибка при попытке открыть Spotify.');
      return;
    }
    res.send('Spotify открыT.');
  });
});

app.get('/open_youtube', res => {
  exec('start https://m.youtube.com/', (error) => {
    if (error) {
      console.error(`exec error: ${error}`);
      res.status(500).send('Произошла ошибка при попытке открыть YouTube.');
      return;
    }
    res.send('YouTube открыт.');
  });
});

app.get('/open_forza5', res => {
  openForzaHorizon5();
  
  // Отправляем ответ
  res.send('Открываю игру Forza Horizon 5...');
});

app.get('/system_info', res => {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();

  osUtils.cpuUsage((cpuUsage) => {
    si.cpuTemperature()
      .then(() => {
        si.graphics()
          .then(gpuData => {
            const gpu = gpuData.controllers[0];
            const info = `Всего памяти: ${Math.round((totalMem - 1000000000) / 1000000000)} GB\n
Доступно памяти: ${Math.round(freeMem / 1000000000)} GB\n
Загруженность процессора: ${(cpuUsage * 100).toFixed(2)}%\n
Видеокарта: ${gpu.model}\n
Загруженность видеокарты: ${(gpu.memoryUsed / gpu.memoryTotal * 100).toFixed(2)}%\n
Температура видеокарты: ${gpu.temperatureGpu}°C\n`;
            res.send(info);
          })
          .catch(error => {
            res.status(500).send(`Ошибка при получении данных: ${error.message}`);
          });
      })
      .catch(error => {
        res.status(500).send(`Ошибка при получении данных: ${error.message}`);
      });
  });
});

app.listen(port, () => {
  console.log(`Сервер запущен: http://localhost:${port}`);
});