const express = require("express");
const FileService = require("../services/fileService");
const router = express.Router();
const multer = require("multer");
const CourseService = require("../services/courseService");

const courseService = new CourseService();

const uploader = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            var dir =
                path.resolve() + directory;
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
})

router.get("/submissions", (req, res) => {

})

router.get("/", (req, res) => {
    res.status(200).json({
        message: "Hello World! Course controller",
    });
});

router.post("/", (req, res) => { });

router.delete("/", (req, res) => { });

router.put("/", (req, res) => { });

router.get("/student", (req, res) => {
    res.status(200).json({
        message: "Hello World! Course controller",
    });
});

router.put("/student", (req, res) => { });

router.get("/teacher", (req, res) => {
    res.status(200).json({
        message: "Hello World! Course controller",
    });
});

router.post("/teacher", (req, res) => { });

module.exports = router;
