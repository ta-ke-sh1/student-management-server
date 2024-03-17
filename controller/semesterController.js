const express = require("express");
const { ScheduleService } = require("../services/schedulingService");
const router = express.Router();

const scheduleService = new ScheduleService();

router.get("/groups", async (req, res) => {
  try {
    let result = await scheduleService.fetchAllGroups();
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

router.get("/schedules", async (req, res) => {
  try {
    const id = req.query.id;
    const result = await scheduleService.fetchScheduleByGroupId(id);
    console.log(result);
    res.status(200).json({
      status: true,
      data: result !== -1 ? result : [],
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
    let result = await scheduleService.fetchParticipantsByGroupId(req.query.id);
    res.status(200).json({
      status: true,
      data: result !== -1 ? result : [],
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e.toString(),
    });
  }
});

router.delete("/participants", async (req, res) => {
  try {
    let result = await scheduleService.deleteParticipantFromGroup(req.query.groupId, req.query.studentId)
    res.status(200).json({
      status: true,
      data: result !== -1 ? result : [],
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

router.get("/courses", async (req, res) => {
  try {
    let data = [];
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

module.exports = router;
