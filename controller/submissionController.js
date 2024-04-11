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
        console.log(req.query);
        let result = await courseService.fetchSubmissionById(id);
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

router.get("/course", async (req, res) => {
    try {
        let result = await courseService.fetchSubmissionsByAssignmentId(
            req.query.id
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

router.delete("/file", async (req, res) => {
    try {
        console.log(req.query);
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

router.post("/submit", uploader.array("files", 10), async (req, res) => {
    try {
        let result = await gradingService.addGrading(req.body, req.files);

        res.status(200).send({
            status: true,
            data: result,
        });
    } catch (e) {
        res.status(200).send({
            status: false,
            data: e.toString(),
        });
    }
});

router.put("/submit", uploader.array("items", 10), async (req, res) => {
    try {
        var fileNames = [];
        console.log(req.files);
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
            status: true,
            data: result,
        });
    } catch (e) {
        res.status(200).send({
            status: false,
            data: e.toString(),
        });
    }
});

router.post("/grade", async (req, res) => {
    try {
        console.log(req.body);
        await gradingService.submitGrade(req.body);
        res.status(200).send({
            status: true,
            data: "Grade submitted successfully!",
        });
    } catch (e) {
        res.status(200).send({
            status: false,
            data: e.toString(),
        });
    }
});

module.exports = router;
