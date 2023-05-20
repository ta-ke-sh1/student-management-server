const express = require("express");
const { fetchAllData } = require("../services/database");
const router = express.Router();

router.get("/", async (req, res) => {
    const users = await fetchAllData("User");
    res.status(200).send(users);
});

router.post("/", (req, res) => {});

router.delete("/", (req, res) => {});

router.put("/", (req, res) => {});

module.exports = router;
