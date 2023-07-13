const path = require("path");
const multer = require("multer");
const fs = require("fs");

module.exports = class FileService {
    constructor() {
        this.uploadHandler = multer({
            storage: multer.diskStorage({
                destination: function (req, file, cb) {
                    var dir =
                        path.resolve() + "/assets/avatar/" + req.body.username;
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
                    cb(null, dir);
                },
                filename: function (req, file, cb) {
                    cb(null, req.body.username + "_" + file.originalname);
                },
            }),
        });
    }

    async changeDir(oldDir, newDir) {}

    async deleteFile(file_dir) {}

    async renameFile(file_dir, name) {}
};
