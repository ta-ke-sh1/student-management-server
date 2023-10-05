const express = require("express");
const router = express.Router();
const multer = require("multer");
const CourseService = require("../services/courseService");
const fs = require("fs");
const path = require("path");
const Utils = require("../utils/utils");

const courseService = new CourseService();

const uploader = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      console.log(req.body.path);
      var dir = path.resolve() + "\\" + req.body.path ?? "";
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      cb(null, Date.parse(new Date()) + "&" + file.originalname);
    },
  }),
});

router.post("/submit", uploader.array("items", 10), async (req, res) => {
  try {
    var fileNames = [];
    for (let i = 0; i < req.files.length; i++) {
      let filename = req.files[i].filename;
      let timestamp = parseInt(filename.split("&")[0]);
      fileNames.push({ name: filename, timestamp: timestamp });
    }

    let assignment = req.body;
    delete assignment.fileNames;
    assignment.submissions = fileNames;

    let result = "";
    // let result = await courseService.submitAssignment(assignment);

    res.status(200).send({
      success: true,
      data: result,
    });
  } catch (e) {
    res.status(200).send({
      success: false,
      data: e,
    });
  }
});

router.put("/submit", uploader.array("items", 10), async (req, res) => {
  try {
    var fileNames = [];
    for (let i = 0; i < req.files.length; i++) {
      let filename = req.files[i].filename;
      let timestamp = parseInt(filename.split("&")[0]);
      fileNames.push({ name: filename, timestamp: timestamp });
    }

    let assignment = req.body;
    delete assignment.fileNames;
    assignment.submissions = fileNames;

    let result = "";
    // let result = await courseService.submitAssignment(assignment);

    res.status(200).send({
      success: true,
      data: result,
    });
  } catch (e) {
    res.status(200).send({
      success: false,
      data: e,
    });
  }
});

router.get("/resources", async (req, res) => {});

router.get("/resource/download", async (req, res) => {
  try {
    let file = req.query.path;
    var dir = path.resolve() + "\\" + file ?? "";
    let utils = new Utils();
    let exists = utils.isResourceExists(dir);
    if (exists) {
      res.status(200).download(dir);
    } else {
      res.status(200).json({
        status: false,
        data: "File does not exist!",
      });
    }
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e,
    });
  }
});

router.post("/resources", uploader.array("items", 10), async (req, res) => {
  try {
    var fileNames = [];
    for (let i = 0; i < req.files.length; i++) {
      let filename = req.files[i].filename;
      let timestamp = parseInt(filename.split("&")[0]);
      fileNames.push({ name: filename, timestamp: timestamp });
    }

    let assignment = req.body;
    delete assignment.fileNames;
    assignment.submissions = fileNames;

    res.status(200).json({
      status: true,
      data: assignment,
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e,
    });
  }
});

router.put("/resources", uploader.array("items", 10), async (req, res) => {});

router.delete("/resources", async (req, res) => {
  try {
    console.log(req.query);
    let result = await courseService.deleteResourceByQuery(req.query);
    console.log(result);
    res.status(200).json({
      status: true,
      data: result,
    });
  } catch (e) {
    console.log(e);
    res.status(200).json({
      status: false,
      data: e,
    });
  }
});

router.get("/submissions", (req, res) => {
  res.status(200).json({ status: true, data: "Submitted" });
});

router.get("/", async (req, res) => {
  console.log(req.query.campus);
  let courses = await courseService.fetchCourseByCampus(req.query.campus);
  res.status(200).json([...courses]);
});

router.post("/", (req, res) => {});

router.delete("/", (req, res) => {});

router.put("/", (req, res) => {});

router.get("/student", async (req, res) => {
  console.log(req.query);

  let semester = req.query.semester;
  let user_id = req.query.id;
  let course_id = req.query.course;

  let course = await courseService.fetchCourseByUserIdAndCourseId(semester, user_id, course_id);

  res.status(200).json({
    message: "Hello World! Course controller",
    course: course,
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
