const express = require("express");
const { json } = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "UPDATE", "DELETE", "PUT"],
  })
);

app.use(json());

app.use(express.static(__dirname + "/asset"));
app.use(express.urlencoded({ extended: true }));

const authController = require("./controller/authController");
app.use("/auth", authController);

const campusController = require("./controller/campusController");
app.use("/campus", campusController);

const courseController = require("./controller/courseController");
app.use("/course", courseController);

const scheduleController = require("./controller/scheduleController");
app.use("/schedule", scheduleController);

const submissionController = require("./controller/submissionController");
app.use("/submission", submissionController);

const semesterController = require("./controller/semesterController");
app.use("/semester", semesterController);

const subjectController = require("./controller/subjectController");
app.use("/subject", subjectController);

const userController = require("./controller/userController");
app.use("/user", userController);

const requestController = require("./controller/requestController");
app.use("/request", requestController);

const documentController = require("./controller/documentsController")
app.use("/document", documentController)

// Homepage
app.get("/", async (req, res) => {
  res.status(200).json({ msg: "Hello world!" });
});

const MockService = require("./services/mockService");

app.get("/mock", async (req, res) => {
  const mockService = new MockService();
  await mockService.AddGroup();
  res.status(200).json({});
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT);

console.log("Server is running! " + PORT);
