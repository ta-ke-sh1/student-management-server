const express = require("express");
const app = express();
require("dotenv").config();

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

const authController = require("./controller/authController");
app.use("/auth", authController);

const campusController = require("./controller/campusController");
app.use("/campus", campusController);

const courseController = require("./controller/courseController");
app.use("/course", courseController);

const scheduleController = require("./controller/scheduleController");
app.use("/schedule", scheduleController);

const semesterController = require("./controller/semesterController");
app.use("/semester", semesterController);

const subjectController = require("./controller/subjectController");
app.use("/subject", subjectController);

const userController = require("./controller/userController");
app.use("/user", userController);

// Homepage
app.get("/", async (req, res) => {
    res.status(200).json({ msg: "Hello world!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log("Server is running! " + PORT);
