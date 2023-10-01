const express = require("express");
const { fetchAllData } = require("../repository/firebaseRepository");
const constants = require("../utils/constants");
const router = express.Router();

const AES = require("crypto-js/aes");

const multer = require("multer");
const fs = require("fs");
const { UserService } = require("../services/userService");

const userService = new UserService();

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

router.post("/", async (req, res) => {
    let user = {
        ...req.body,
        avatar: "/avatar/default_avatar.jpg",
        status: "activated",
        password: AES.encrypt("123456", process.env.ENCRYPT_KEY).toString(),
    };

    console.log(user);

    let response = await userService.addUser(user);
    res.status(200).json({ result: response.msg });
});

router.delete("/", (req, res) => {
    
});

router.put("/", async (req, res) => {
    const id = req.query.id;
    const update_obj = req.body;
    let response = await userService.editUser(id, update_obj);
    res.status(200).json({ result: response.msg });
});

module.exports = router;
