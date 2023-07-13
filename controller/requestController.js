const express = require("express");
const RequestService = require("../services/requestService");
const router = express.Router();

const requestSerivce = new RequestService();

router.get("/", (req, res) => {
    let requests = requestSerivce.fetchRequests();
    res.json(requests);
});

router.post("/", (req, res) => {});

router.delete("/", (req, res) => {});

router.put("/", (req, res) => {});

module.exports = router;
