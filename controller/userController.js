const express = require("express");
const { fetchAllData } = require("../repository/firebaseRepository");
const constants = require("../utils/constants");
const router = express.Router();

const multer = require("multer");
const fs = require("fs");

const uploader = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            var dir = path.resolve() + "/assets/avatar" + req.path;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            cb(null, dir);
        },
        filename: function (req, file, cb) {
            cb(null, "_" + file.filename);
        },
    }),
});

router.get("/", async (req, res) => {
    const users = await fetchAllData(constants.USERS_TABLE);
    res.status(200).send(users);
});

router.post("/", (req, res) => {});

router.delete("/", (req, res) => {});

router.put("/", (req, res) => {});

module.exports = router;
