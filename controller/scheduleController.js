const express = require("express");
const { ScheduleService } = require("../services/schedulingService");
const router = express.Router();
const { containsRole } = require("../middleware/tokenCheck");

const scheduleService = new ScheduleService();

router.get("/", async (req, res) => {
  console.log(req.query);
  // const schedules = scheduleService.fetchAllSchedules(campus);
  try {
    const groups = await scheduleService.fetchGroupsByProgrammeAndTerm(req.query.programme, req.query.term, req.query.department);
    res.status(200).json(groups);
  } catch (e) {
    res.status(300).json({
      status: false,
      error: e,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const result = await scheduleService.addSchedule(req.body);
    res.status(200).json(result);
  } catch (e) {
    res.status(200).json({
      status: false,
      error: e,
    });
  }
});

router.put("/", async (req, res) => {
  try {
    const result = await scheduleService.editSchedule(req.query.id, req.body);
    res.status(200).json(result);
  } catch (e) {
    res.status(200).json({
      status: false,
      error: e,
    });
  }
});

router.post("/group", async (req, res) => {
  try {
    const result = await scheduleService.addGroup(req.body);
    res.status(200).json(result);
  } catch (e) {
    res.status(200).json({
      status: false,
      error: e,
    });
  }
});

router.put("/restore", (req, res) => {});

router.delete("/", (req, res) => {});

router.delete("/hard", containsRole(3), (req, res) => {});

router.get("/student", async (req, res) => {
  console.log(req.query);
  try {
    let result = await scheduleService.fetchScheduleByLecturerIdAndDateAndTermAndProgrammeAndDepartment(req.query);
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

router.get("/lecturer", async (req, res) => {
  console.log(req.query);
  try {
    let result = await scheduleService.fetchScheduleByStudentIdAndDateAndTermAndProgrammeAndDepartment(req.query);
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

router.post("attendance", async (req, res) => {
  const attendace = req.body;
  try {
    let result = await scheduleService.checkAttendance(attendace);
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
