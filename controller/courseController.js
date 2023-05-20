const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({
        message: "Hello World! Course controller",
    });
});

router.post("/", (req, res) => {});

router.delete("/", (req, res) => {});

router.put("/", (req, res) => {});

module.exports = router;
