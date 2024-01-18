const dgram = require('dgram');
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 2999;

app.use(express.static('public'));
app.use(cors());

app.get('/logs', async (req, res) => {
  const { TimeFrom, TimeTo } = req.query;
  let files = fs.readdirSync('./logs');
  if(TimeFrom && TimeTo) {
    files = files.filter((file) => {
      const date = file.split('_')[1].split('.')[0];
      return date >= TimeFrom && date <= TimeTo;
    });
  }
  files = files.sort((a, b) => {
    return fs.statSync('./logs/' + a).mtime.getTime() -
      fs.statSync('./logs/' + b).mtime.getTime();
  });
  let logs = {};
  for(let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      const data = fs.readFileSync('./logs/' + file, 'utf8');
      logs[file] = data.split(/<\d+>/).filter((line) => line !== '' && line !== '\n').map((line) => line.replace(/\n/g, '').replace(/\r/g, ''));
    } catch (e) {
      console.log(e);
    }
  }
  res.send(logs);
});
//serve public folder
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = dgram.createSocket('udp4');
const logDirectory = './logs';
const maxFileSize = 500000; // in Kilobytes

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

let currentLogFile = createNewLogFile();

function createNewLogFile() {
  const filename = `log_${new Date().toISOString().replace(/:/g, '-')}.log`;
  const filepath = path.join(logDirectory, filename);
  fs.writeFileSync(filepath, ''); // Create an empty log file
  return filepath;
}

function checkFileSizeAndRotate(file) {
  const stats = fs.statSync(file);
  const fileSizeInKilobytes = stats.size / 1024;
  if (fileSizeInKilobytes > maxFileSize) {
    return createNewLogFile();
  }
  return file;
}

server.on('message', (msg) => {
  currentLogFile = checkFileSizeAndRotate(currentLogFile);
  fs.appendFileSync(currentLogFile, msg + '\n', 'utf8');
});

server.on('listening', () => {
  const address = server.address();
  console.log(`Server listening ${address.address}:${address.port}`);
});



server.bind(514); // Syslog uses port 514

app.listen(port, () => console.log(`Example app listening on port ${port}!`));