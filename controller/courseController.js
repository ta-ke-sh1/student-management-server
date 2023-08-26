const express = require("express");
const router = express.Router();
const multer = require("multer");
const CourseService = require("../services/courseService");
const fs = require("fs");

const courseService = new CourseService();

const uploader = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            var dir = path.resolve() + "/asset/submissions" + req.path;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            cb(null, dir);
        },
        filename: function (req, file, cb) {
            cb(null, "_" + file.filename);
        },
    }),
});

router.post("/submission", uploader.array("items", 10), (req, res) => {
    console.log("new item request");
    var fileNames = [];
    for (let i = 0; i < req.files.length; i++) {
        fileNames.push(req.files[i].filename);
    }

    res.status(200).send({
        success: true,
    });
});

router.get("/submissions", (req, res) => {});

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

    let course = await courseService.fetchCourseByUserIdAndCourseId(
        semester,
        user_id,
        course_id
    );

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
