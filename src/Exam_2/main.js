const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;
const FileWatcher = require('./FileWatcher');
const fs = require('fs');
const notifier = require('node-notifier');

const { name, path } = argv;

const openToastNotification = (fullPath) => {
  notifier.notify({
    title: 'Warning',
    message: `Your name was mentioned on file: ${fullPath}`,
  });
};

const printToConsole = (fullPath) => {
  console.log(`Your name was mentioned on file: "${fullPath}"`);
};

const startWatcher = () => {
  if (!name || !path) {
    console.log('Invalid parameters.');
    return;
  }

  console.log(`Watching path: ${path}`);

  const fileWatcher = new FileWatcher(path, name);
  fileWatcher.on('nameFoundOnFile', openToastNotification);
  fileWatcher.on('nameFoundOnFile', printToConsole);
  fileWatcher.watchFiles();
};

startWatcher();
