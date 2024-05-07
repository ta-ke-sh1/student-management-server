const express = require("express");
const AttendanceService = require("../services/attendanceService");
const router = express.Router();

/// host url + "/attendance"

// Lay
// Lay data tu query (URL)
router.get("/", async (req, res) => {
    try {
        let data;
        const attendanceService = new AttendanceService();
        if (req.query.id && req.query.id !== "") {
            data = await attendanceService.fetchAttendanceById(req.query.id);
        } else {
            data = await attendanceService.fetchAllAttendance();
        }

        res.status(200).json({
            status: true,
            data: data
        })
    } catch (e) {
        res.status(200).json({
            status: false,
            data: e.toString()
        })
    }
})

// Them
// Lay data tu body
router.post("/", async (req, res) => {
    try {
        const attendanceService = new AttendanceService();
        await attendanceService.addAttendance(req.body)
        res.status(200).json({
            status: true,
        })
    } catch (e) {
        res.status(200).json({
            status: false,
            data: e.toString()
        })
    }
})

// Sua
// Lay data tu body
router.put("/", async (req, res) => {
    try {
        const attendanceService = new AttendanceService();
        await attendanceService.editAttendance(req.body.id, req.body)
        res.status(200).json({
            status: true,
        })
    } catch (e) {
        res.status(200).json({
            status: false,
            data: e.toString()
        })
    }
})

//Xoa
// Lay data tu query (URL)
router.delete("/", async (req, res) => {
    try {
        const attendanceService = new AttendanceService();
        await attendanceService.deleteAttendance(req.query.id);
        res.status(200).json({
            status: true,
        })
    } catch (e) {
        res.status(200).json({
            status: false,
            data: e.toString()
        })
    }
})

module.exports = router;