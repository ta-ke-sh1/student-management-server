const express = require("express");
const { ScheduleService } = require("../services/schedulingService");
const router = express.Router();

const scheduleService = new ScheduleService();

router.get("/schedules", async (req, res) => {
    try {
        console.log(req.query)
        let result = await scheduleService.fetchScheduleByIdAndTermAndProgrammeAndDepartment(req.query.id, req.query.term, req.query.programme, req.query.department);
        res.status(200).json(result)
    } catch (e) {
        res.status(200).json({
            status: false,
            data: e
        })
    }
});

router.get("/participants", async (req, res) => {
    try {
        let result = await scheduleService.fetchParticipantsByIdAndTermAndProgrammeAndDepartment(req.query.id, req.query.term, req.query.programme, req.query.department);
        res.status(200).json(result)
    } catch (e) {
        res.status(200).json({
            status: false,
            data: e
        })
    }
});

router.post("/", async (req, res) => {
    try {
        res.status(200).json({
            status: true,
        })
    } catch (e) {
        res.status(200).json({
            status: false,
            data: e
        })
    }
});

router.delete("/", async (req, res) => {
    try {
        res.status(200).json({
            status: true,
        })
    } catch (e) {
        res.status(200).json({
            status: false,
            data: e
        })
    }
});

router.put("/", async (req, res) => {
    try {
        res.status(200).json({
            status: true,
        })
    } catch (e) {
        res.status(200).json({
            status: false,
            data: e
        })
    }
});

module.exports = router;
