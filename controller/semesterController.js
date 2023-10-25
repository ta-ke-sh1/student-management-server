const express = require("express");
const { ScheduleService } = require("../services/schedulingService");
const router = express.Router();

const scheduleService = new ScheduleService();

router.get("/schedules", async (req, res) => {
  try {
    console.log(req.query);
    let result = await scheduleService.fetchScheduleByIdAndDateAndTermAndProgrammeAndDepartment(req.query);
    res.status(200).json({
      status: true,
      data: result
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
    let result = await scheduleService.fetchParticipantsByIdAndTermAndProgrammeAndDepartment(req.query.id, req.query.term, req.query.programme, req.query.department);
    res.status(200).json({
      status: true,
      data: result
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

router.delete("/", async (req, res) => {
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

router.put("/", async (req, res) => {
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

module.exports = router;
