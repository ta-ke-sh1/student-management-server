const express = require("express");
const router = express.Router();

const multer = require("multer");

const CourseService = require("../services/courseService");
const FileService = require("../services/fileService");
const { GradingService } = require("../services/gradingService");

const uploader = multer({ dest: "uploads/" });

const courseService = new CourseService();
const fileService = new FileService();
const gradingService = new GradingService();

router.get("/", async (req, res) => {
  try {
    const id = req.query.id;
    const user = req.query.user;
    const asm = req.query.assignment;
    console.log(req.query);
    let result = await courseService.fetchSubmissionByCourseIdAndUserAndAssignmentId(id, user, asm);
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

router.post("/", uploader.array("files", 10), async (req, res) => {
  try {
    let data = await gradingService.addGrading(req.body, req.files);
    res.status(200).json({
      status: true,
      data: data,
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e.toString(),
    });
  }
});

router.put("/", uploader.array("file", 10), async (req, res) => {
  try {
    fileService.removeFileByPath(req.query.path);
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

router.delete("/", async (req, res) => {
  try {
    fileService.removeFileByPath(req.query.path);
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

module.exports = router;
