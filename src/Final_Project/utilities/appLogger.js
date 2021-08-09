const fs = require('fs');

const LOG_FILENAME = './src/Final_Project/logs/AttendanceMonitoryLogs';

const getLogFilename = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();

  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDay = day < 10 ? `0${day}` : day;

  return `${LOG_FILENAME}-${year}-${formattedMonth}-${formattedDay}.txt`;
};

const appLogger = (req, res, next) => {
  const { protocol, url } = req;
  const host = req.get('host');
  const endpoint = `${protocol}://${host}${url}`;
  const headers = JSON.stringify(req.headers);
  const body = JSON.stringify(req.body);

  const filename = getLogFilename();
  const log = `${endpoint} | ${headers} | ${body}`;

  fs.appendFile(filename, `${log}\n`, (err) => {
    if (err) console.log(err);
  });

  next();
};

module.exports = appLogger;
