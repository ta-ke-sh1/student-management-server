const fs = require("fs");

module.exports = class Utils {
  async isNonEmptyObject(obj) {
    let values = Object.values(obj);
    return values.includes("");
  }

  randomIntWithinRange(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  isResourceExists(dir) {
    return fs.existsSync(dir);
  }

  async deleteFileByPath(dir) {
    if (isResourceExists(dir)) {
      fs.unlink(dir, (err) => {
        if (err) {
          return {
            status: false,
            data: err,
          };
        }
      });

      return {
        status: true,
        data: "File deleted",
      };
    } else {
      return {
        status: true,
        data: "File does not exist!",
      };
    }
  }
};
