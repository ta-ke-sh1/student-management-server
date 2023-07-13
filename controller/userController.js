const express = require("express");
const { fetchAllData } = require("../repository/firebaseRepository");
const constants = require("../utils/constants");
const router = express.Router();

router.get("/", async (req, res) => {
    const users = await fetchAllData(constants.USERS_TABLE);
    res.status(200).send(users);
});

router.post("/", (req, res) => {});

router.delete("/", (req, res) => {});

router.put("/", (req, res) => {});

module.exports = router;
