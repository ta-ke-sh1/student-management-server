const fs = require("fs");
const path = require("path");

module.exports = class FileService {
  constructor() { }

  addMultipleFilesByPath(files, file_path) {
    try {
      if (!fs.existsSync(file_path)) {
        fs.mkdirSync(file_path, { recursive: true }, (err) => {
          throw err;
        });
      }

      files.forEach((file) => {
        fs.renameSync(file.path, path.join(file_path, file.originalname), (err) => {
          if (err) {
            throw err;
          } else {
            console.log("Succeed");
          }
        });
      });
    } catch (e) {
      console.log(e.toString());
      return false;
    }
  }

  addFileByPath(file, file_path) {
    try {
      if (!fs.existsSync(file_path)) {
        fs.mkdirSync(file_path, { recursive: true }, (err) => {
          throw err;
        });
      }

      fs.renameSync(file.path, path.join(file_path, file.originalname), (err) => {
        if (err) {
          throw err;
        } else {
          console.log("Succeed");
        }
      });
    } catch (e) {
      console.log(e.toString());
      return false;
    }
  }

  removeFileByPath(file_path) {
    try {
      if (file_path) {
        fs.unlink(path.join(__dirname, file_path), (err) => {
          if (err) {
            console.log(err);
            return false;
          }
        });
        return true;
      }
      return false;
    } catch (e) {
      console.log(e.toString());
      return false;
    }
  }
};
