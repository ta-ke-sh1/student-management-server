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

router.get("/student", (req, res) => {
    res.status(200).json({
        message: "Hello World! Course controller",
    });
});

router.put("/student", (req, res) => {});

router.get("/teacher", (req, res) => {
    res.status(200).json({
        message: "Hello World! Course controller",
    });
});

router.post("/teacher", (req, res) => {});

module.exports = router;
