const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

module.exports = class FileWatcher extends EventEmitter {
  constructor(directoryPath, name) {
    super();
    this.directoryPath = directoryPath;
    this.name = name;
  }

  async searchContent(fullPath) {
    try {
      const content = await fs.promises.readFile(fullPath, 'utf8');
      if (content && content.toLowerCase().includes(this.name.toLowerCase())) {
        this.emit('nameFoundOnFile', fullPath);
      }
    } catch (error) {
      console.log(error);
    }
  }

  watchFiles = async () => {
    let isBusy = false;
    try {
      const watcher = fs.promises.watch(this.directoryPath, {
        recursive: true,
      });
      for await (const { eventType, filename } of watcher) {
        if (!isBusy) {
          isBusy = true;
          const fullPath = path.join(this.directoryPath, filename);
          console.log(fullPath);
          // Check if path is a valid file or directory
          if (fs.existsSync(fullPath)) {
            const fileStatus = await fs.promises.lstat(fullPath);

            // Process if File only
            if (fileStatus.isFile()) {
              // Added 2 secs time to process the first request
              // before processing the next event
              setTimeout(() => {
                this.searchContent(fullPath);
                isBusy = false;
              }, 2000);
            } else isBusy = false;
          } else isBusy = false;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  //   await fs.watch(
  //     this.directoryPath,
  //     { recursive: true },
  //     (eventType, filename) => {
  //       if (isBusy || eventType === 'rename') return;
  //       isBusy = true;
  //       setTimeout(async () => {
  //         const fullPath = path.join(this.directoryPath, filename);
  //         const fileStatus = await fs.lstat(fullPath);

  //         if (!fileStatus.isDirectory()) {
  //           this.searchContent();
  //         } else {
  //           console.log('Directory');
  //         }

  //         this.validateName(filename);
  //         isBusy = false;
  //       }, 2000);
  //     }
  //   );
  // };
  //};
};
