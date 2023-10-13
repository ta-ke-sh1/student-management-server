const express = require("express");
const { fetchAllData } = require("../repository/firebaseRepository");
const constants = require("../utils/constants");
const router = express.Router();

const AES = require("crypto-js/aes");

const multer = require("multer");
const fs = require("fs");
const path = require("path");

const { UserService } = require("../services/userService");

const userService = new UserService();

const uploader = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      try {
        var dir = path.resolve() + "\\asset\\avatar\\" + req.query.username ? req.query.username + "\\" : "";
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
      } catch (e) {
        console.log(e);
      }
    },
    filename: function (req, file, cb) {
      cb(null, "avatar.jpg");
    },
  }),
});

router.get("/admins", async (req, res) => {
  try {
    const users = await userService.fetchAllUsers("admin");
    console.log("Admin: " + users.length)
    res.status(200).json({
      status: true,
      data: users ?? [],
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      error: e,
    });
  }
});

router.get("/lecturers", async (req, res) => {
  try {
    const users = await userService.fetchAllUsers("lecturer");
    console.log("Lecturers" + users.length)
    res.status(200).json({
      status: true,
      data: users ?? [],
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      error: e,
    });
  }
});

router.get("/students", async (req, res) => {
  try {
    const users = await userService.fetchAllUsers("student");
    console.log("Students" + users.length)
    res.status(200).json({
      status: true,
      data: users ?? [],
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      error: e,
    });
  }
});

router.get("/deactivate", async (req, res) => {
  try {
    await userService.deactivateUser(req.query.id);
    res.status(200).send(users);
  } catch (e) {
    res.status(200).json({
      status: false,
      error: e,
    });
  }
});

router.put("/avatar", uploader.single("avatar"), async (req, res) => {
  try {
    res.status(200).json({
      status: true,
      data: "Success",
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      error: e,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    let user = {
      ...req.body,
      avatar: "/avatar/default.jpg",
      status: "activated",
      password: AES.encrypt("123456", process.env.ENCRYPT_KEY).toString(),
    };

    console.log(user);

    let response = await userService.addUser(user);
    res.status(200).json({ result: response.msg });
  } catch (e) {
    res.status(200).json({
      status: false,
      error: e,
    });
  }
});

router.delete("/", (req, res) => {
  try {
  } catch (e) {
    res.status(200).json({
      status: false,
      error: e,
    });
  }
});

router.put("/", async (req, res) => {
  try {
    const id = req.query.id;
    const update_obj = req.body;
    let response = await userService.editUser(id, update_obj);
    res.status(200).json({ result: response.msg });
  } catch (e) {
    res.status(200).json({
      status: false,
      error: e,
    });
  }
});

module.exports = router;
