const { existsSync, promises: { readdir, lstat, unlink, rmdir } } = require('fs');

const file = {
  async removeDirRecursive (directory) {
    if (existsSync(directory)) {
      const files = await readdir(directory);
      for (const file of files) {
        const currentPath = `${directory}/${file}`;
        const stat = await lstat(currentPath);

        if (stat.isDirectory()) {
          await this.removeDirRecursive(currentPath);
        } else {
          await unlink(currentPath);
        }
      }
      await rmdir(directory);
    }
  }
};

module.exports = file;
