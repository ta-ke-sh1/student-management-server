const express = require("express");
const { ScheduleService } = require("../services/schedulingService");
const router = express.Router();

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

router.post("/create", async (req, res) => {
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

router.delete("/", (req, res) => {});

module.exports = router;
