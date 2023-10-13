const express = require("express");
const router = express.Router();

const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { GradingService } = require("../services/gradingService");
const CourseService = require("../services/courseService");

const uploader = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      try {
        var dir = path.resolve() + "\\asset\\submissions\\" + req.body.programme + "\\" + req.body.term + "\\" + req.body.subject + "\\" + req.body.group + "\\" + req.body.username + "\\" + req.body.assignment + "\\";
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
      } catch (e) {
        console.log(e);
      }
    },
    filename: function (req, file, cb) {
      cb(null, file.filename);
    },
  }),
});

const courseService = new CourseService();

router.get("/", async (req, res) => {
  try {
    const id = req.query.id
    const user = req.query.user
    const asm = req.query.assignment
    console.log(req.query)
    let result = await courseService.fetchSubmissionByCourseIdAndUserAndAssignmentId(id, user, asm)
    res.status(200).json({
      status: true,
      data: result
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e,
    });
  }
});

router.post("/", uploader.array("file", 10), async (req, res) => {
  try {
    res.status(200).json({
      status: true,
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e,
    });
  }
});

router.put("/", async (req, res) => {
  try {
    res.status(200).json({
      status: true,
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    res.status(200).json({
      status: true,
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e,
    });
  }
});

module.exports = router;
