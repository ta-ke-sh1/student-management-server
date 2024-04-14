const express = require("express");
const { ScheduleService } = require("../services/schedulingService");
const router = express.Router();
const { containsRole } = require("../middleware/tokenCheck");

const scheduleService = new ScheduleService();

router.get("/attendance/all", async (req, res) => {
    try {
        const schedules = await scheduleService.fetchAttendances();
        res.status(200).json({
            status: true,
            data: schedules,
        });
    } catch (e) {
        res.status(200).json({
            status: false,
            data: e.toString(),
        });
    }
});

router.get("/all", async (req, res) => {
    try {
        const schedules = await scheduleService.fetchSchedules();
        res.status(200).json({
            status: true,
            data: schedules,
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
        console.log(req.query);
        const groups = await scheduleService.fetchGroupsByProgrammeAndTerm(
            req.query.programme,
            req.query.term,
            req.query.department
        );
        res.status(200).json({
            status: true,
            data: groups,
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
        const result = await scheduleService.addSchedule(req.body);
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

router.post("/participant", async (req, res) => {
    try {
        const result = await scheduleService.addParticipantToGroup(req.body);
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
        const result = await scheduleService.editSchedule(
            req.query.id,
            req.body
        );
        res.status(200).json(result);
    } catch (e) {
        res.status(200).json({
            status: false,
            data: e.toString(),
        });
    }
});

router.post("/group", async (req, res) => {
    try {
        let result = await scheduleService.addGroupAndCreateSchedules(req.body);
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

router.put("/group", async (req, res) => {
    try {
        let result = await scheduleService.updateGroup(req.query.id, req.body);
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

router.delete("/group", async (req, res) => {
    try {
        let result = true;
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

router.put("/restore", (req, res) => {});

router.delete("/", async (req, res) => {
    try {
        let query = req.query.queue.split("%");
        await scheduleService.deleteSchedules(query);
        console.log(query);
        res.status(200).json({
            status: false,
        });
    } catch (e) {
        res.status(200).json({
            status: false,
            data: e.toString(),
        });
    }
});

router.delete("/hard", containsRole(3), (req, res) => {});

router.get("/info/schedule", async (req, res) => {
    let q = req.query;
    let data = await scheduleService.fetchScheduleByGroupId(q.id);
    try {
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

router.get("/info/participants", async (req, res) => {
    let q = req.query;
    let data = await scheduleService.fetchParticipantsByGroupId(q.id);
    try {
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

router.get("/student", async (req, res) => {
    try {
        console.log(req.query);
        let result = await scheduleService.fetchScheduleByStudentIdAndDate(
            req.query
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

router.get("/lecturer", async (req, res) => {
    console.log(req.query);
    try {
        let result = await scheduleService.fetchScheduleByLecturerIdAndDate(
            req.query
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
        console.log("Fetch attendances " + req.query.id);
        let result = await scheduleService.fetchAllAttendancesByScheduleId(
            req.query.id
        );
        res.status(200).json({
            status: true,
            data: result === -1 ? [] : result,
        });
    } catch (e) {
        res.status(200).json({
            status: false,
            data: e.toString(),
        });
    }
});

router.post("/attendance", async (req, res) => {
    const attendance = req.body;
    try {
        console.log(attendance);
        let result = await scheduleService.checkAttendance(attendance);
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
