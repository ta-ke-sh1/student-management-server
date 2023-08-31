const express = require("express");
const { ScheduleService } = require("../services/schedulingService");
const router = express.Router();

const scheduleService = new ScheduleService();

router.get("/", (req, res) => {
    // const campus = req.query.campus;
    // const schedules = scheduleService.fetchAllSchedules(campus);
    const schedules = [
        {
            id: "1",
            date: 1689220135000,
            class: "GCH0902",
            status: 1,
            subject: "1650",
            room: "G405",
            slot: 1,
            notes: "",
            lecturer: "tungdt",
        },
        {
            id: "2",
            date: 1689220135000,
            class: "GCH0902",
            status: 1,
            subject: "1650",
            room: "G405",
            slot: 2,
            notes: "",
            lecturer: "tungdt",
        },
        {
            id: "3",
            date: 1689120135000,
            class: "GCH0902",
            status: 0,
            subject: "1649",
            room: "G407",
            slot: 3,
            notes: "",
            lecturer: "tungdt",
        },
        {
            id: "4",
            date: 1689120135000,
            class: "GCH0902",
            status: -1,
            subject: "1649",
            room: "G407",
            slot: 4,
            notes: "",
            lecturer: "tungdt",
        },
    ];
    res.status(200).json(schedules);
});

router.post("/", (req, res) => { });

router.delete("/", (req, res) => { });

router.put("/", (req, res) => { });

module.exports = router;
