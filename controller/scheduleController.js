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
            subjectId: "JL5UFScLPrRD8eOnkZfE",
            roomId: "ajyuWACqUBQcYmHv7DJS",
            slot: 1,
            notes: "",
        },
        {
            id: "2",
            date: 1689220135000,
            subjectId: "JL5UFScLPrRD8eOnkZfE",
            roomId: "ajyuWACqUBQcYmHv7DJS",
            slot: 2,
            notes: "",
        },
        {
            id: "3",
            date: 1689120135000,
            subjectId: "2HH5V7OkgUzqBYf1HcOK",
            roomId: "ajyuWACqUBQcYmHv7DJS",
            slot: 3,
            notes: "",
        },
        {
            id: "4",
            date: 1689120135000,
            subjectId: "2HH5V7OkgUzqBYf1HcOK",
            roomId: "ajyuWACqUBQcYmHv7DJS",
            slot: 4,
            notes: "",
        },
    ];
    res.status(200).json(schedules);
});

router.post("/", (req, res) => {});

router.delete("/", (req, res) => {});

router.put("/", (req, res) => {});

module.exports = router;
