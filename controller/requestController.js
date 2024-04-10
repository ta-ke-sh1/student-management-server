const express = require("express");
const RequestService = require("../services/requestService");
const router = express.Router();
const multer = require("multer");

const uploader = multer({ dest: "uploads/" });
const requestSerivce = new RequestService();

router.get("/", async (req, res) => {
  try {
    let result = await requestSerivce.fetchRequests();
    console.log(result)
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

router.post("/", uploader.single("file"), async (req, res) => {
  try {
    let result = await requestSerivce.addRequest(req.body, req.file);
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
    console.log(req)
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
    res.status(200).json({
      status: true,
      data: result
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e.toString(),
    });
  }
});

router.get("/user", async (req, res) => {
  try {
    const id = req.query.id;
    let result = await requestSerivce.fetchUserRequests(id);
    res.status(200).json({
      status: true,
      data: result
    });

  } catch (e) {
    res.status(200).json({
      status: false,
      data: e.toString(),
    });
  }
})

module.exports = router;
