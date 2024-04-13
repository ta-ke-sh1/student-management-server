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

router.get("/resources", async (req, res) => {
    try {
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
            data: e.toString(),
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
            data: e.toString(),
        });
    }
});

router.put("/resources", uploader.array("items", 10), async (req, res) => {
    try {
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

router.delete("/resources", async (req, res) => {
    try {
        let result = await courseService.deleteLocalResourceByQuery(req.query);
        console.log(result);
        res.status(200).json({
            status: true,
            data: result,
        });
    } catch (e) {
        console.log(e);
        res.status(200).json({
            status: false,
            data: e.toString(),
        });
    }
});

router.get("/submissions", async (req, res) => {
    try {
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

router.get("/", async (req, res) => {
    try {
        let courses = await courseService.fetchCourseByUserId(
            req.query.id,
            parseInt(req.query.role)
        );
        res.status(200).json({
            status: true,
            data: [...courses],
        });
    } catch (e) {
        res.status(200).json({
            status: false,
            data: e.toString(),
        });
    }
});

router.get("/details", async (req, res) => {
    try {
        let course = await courseService.fetchCourseById(req.query.id);
        res.status(200).json({
            status: true,
            data: course,
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
        const course = req.body;
        course.status = true;
        const result = await courseService.addCourse(course);
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
        const id = req.query.id;
        const result = await courseService.deleteCourse(id);
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

router.delete("/hard", async (req, res) => {
    try {
        const id = req.query.id;
        const result = await courseService.deleteHardCourse(id);
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

router.put("/", async (req, res) => {
    try {
        let id = req.query.id;
        const result = await courseService.editCourse(id, req.body);
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

router.get("/student", async (req, res) => {
    try {
        let semester = req.query.semester;
        let user_id = req.query.id;
        let course_id = req.query.course;

        let course = await courseService.fetchCourseByUserIdAndCourseId(
            semester,
            user_id,
            course_id
        );
        res.status(200).json({
            status: true,
            data: course,
        });
    } catch (e) {
        res.status(200).json({
            status: false,
            data: e.toString(),
        });
    }
});

router.post("/grade", async (req, res) => {
    try {
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

router.post("/coursework", async (req, res) => {
    try {
        let result = await courseService.addCourseAssignment(req.body);
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

router.get("/courseworks", async (req, res) => {
    try {
        let result = await courseService.fetchCourseworksByCourseId(
            req.query.id
        );
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

router.get("/materials", async (req, res) => {
    try {
        let result = await courseService.fetchMaterialsByCourseId(req.query.id);
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

router.get("/courseworks/submissions", async (req, res) => {
    try {
        let result =
            await courseService.fetchAssignmentsByCourseIdAndAssignmentId(
                req.query.course_id,
                req.query.assignment_id
            );
        res.status(200).json({
            status: true,
            data: result,
        });
    } catch (e) {
        console.log(e.toString());
        res.status(200).json({
            status: false,
            data: e.toString(),
        });
    }
});

router.get("/schedules", async (req, res) => {
    try {
        let result = await courseService.fetchSchedulesByCourseId(req.query.id);
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

router.get("/participants", async (req, res) => {
    try {
        console.log(req.query);
        let result = await courseService.fetchParticipantsByCourseId(
            req.query.id
        );
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

router.get("/attendances", async (req, res) => {
    try {
        console.log(req.query);
        let result = await courseService.fetchAttendancesByCourseId(
            req.query.id,
            parseInt(req.query.session)
        );
        console.log(result);
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

router.get("/lecturer/all", async (req, res) => {
    try {
        let result = await courseService.fetchCourseByLecturerId(req.query.id);
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

module.exports = router;
