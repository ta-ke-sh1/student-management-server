const express = require("express");
const RequestService = require("../services/requestService");
const router = express.Router();

const requestSerivce = new RequestService();

router.get("/", async (req, res) => {
  try {
    let result = await requestSerivce.fetchRequests();
    res.status(200).json({
      status: 200,
      data: result,
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e.toString(),
    });
  }
});

router.post("/", async (req, res) => {
  try {
    let result = await requestSerivce.addRequest(req.body);
    res.status(200).json({
      status: true,
      data: result,
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e.toString(),
    });
  }
});

router.delete("/", async (req, res) => {
  try {
    req.query.id;
    let result = await requestSerivce.deleteRequest(id);
    res.status(200).json({
      status: true,
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e.toString(),
    });
  }
});

router.delete("/hard/", async (req, res) => {
  try {
    const id = req.query.id;
    let result = await requestSerivce.deleteHardRequest(id);
    result = res.status(200).json({
      status: true,
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e.toString(),
    });
  }
});

router.put("/", async (req, res) => {
  try {
    const id = req.query.id;
    let result = await requestSerivce.editRequest(id, req.body);
    result = res.status(200).json({
      status: true,
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e.toString(),
    });
  }
});

router.get("resolve", async (req, res) => {
  try {
    const id = req.query.id;
    const option = req.query.option;
    let result = await requestSerivce.handleRequest(id, option);
    result = res.status(200).json({
      status: true,
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e.toString(),
    });
  }
});

module.exports = router;
