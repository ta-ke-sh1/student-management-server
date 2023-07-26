const express = require("express");
const AuthService = require("../services/authService");
const router = express.Router();

const authService = new AuthService();

router.get("/", (req, res) => {
    res.status(200).json({
        message: "Hello World! Auth controller",
    });
});

router.post("/login", async (req, res) => {
    console.log({
        username: req.body.username,
        password: req.body.password
    })
    const result = await authService.authenticate(req.body.username, req.body.password)
    res.status(200).json(result)
});

router.delete("/", (req, res) => { });

router.put("/", (req, res) => { });

module.exports = router;
