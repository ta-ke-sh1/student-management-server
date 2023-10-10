const express = require("express");
const DocumentService = require("../services/documentsService");
const router = express.Router();

const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploader = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      var dir = path.resolve() + "\\asset\\documents\\";
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      cb(null, file.filename);
    },
  }),
});

const documentSerivce = new DocumentService();

router.get("/", async (req, res) => {
  try {
    let result = await documentSerivce.fetchDocuments();
    res.status(200).json({
      status: 200,
      data: result,
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e,
    });
  }
});

router.post("/", uploader.single("file"), async (req, res) => {
  try {
    let result = await documentSerivce.addDocument(req.body);
    res.status(200).json({
      status: true,
      data: result,
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e,
    });
  }
});

router.delete("/", async (req, res) => {
  try {
    req.query.id;
    let result = await documentSerivce.deleteDocument(id);
    res.status(200).json({
      status: true,
      data: result,
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e,
    });
  }
});

router.delete("/hard/", async (req, res) => {
  try {
    const id = req.query.id;
    let result = await documentSerivce.deleteHardDocument(id);
    result = res.status(200).json({
      status: true,
      data: result,
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e,
    });
  }
});

router.put("/", uploader.single("file"), async (req, res) => {
  try {
    const id = req.query.id;
    let result = await documentSerivce.editDocument(id, req.body);
    result = res.status(200).json({
      status: true,
      data: result,
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e,
    });
  }
});

router.get("resolve", async (req, res) => {
  try {
    const id = req.query.id;
    const option = req.query.option;
    let result = await documentSerivce.handleDocument(id, option);
    result = res.status(200).json({
      status: true,
      data: result,
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e,
    });
  }
});

module.exports = router;
