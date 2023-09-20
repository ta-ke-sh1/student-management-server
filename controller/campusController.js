const express = require("express");
const {
    fetchAllData,
    fetchMatchingDataByField,
} = require("../repository/firebaseRepository");
const constants = require("../utils/constants");
const RoomService = require("../services/roomService");
const CampusService = require("../services/campusService");
const router = express.Router();

const roomService = new RoomService();
const campusService = new CampusService();

router.get("/", async (req, res) => {
    let docs = await fetchAllData(constants.CAMPUS_TABLE);
    res.status(200).json(docs);
});

router.post("/", async (req, res) => {
    let payload = req.body;
    let result = await campusService.addCampus(payload);
    res.status(200).json(result);
});

router.delete("/", async (req, res) => {
    let id = req.query.id;
    let result = await campusService.deleteCampus(id);
    res.status(200).json(result);
});

router.put("/", async (req, res) => { });

router.get("/rooms", async (req, res) => {
    let id = req.query.id;
    let rooms = await roomService.fetchAllRoomsByCampus(id);
    res.status(200).json(rooms);
});

router.get("/room/:id", async (req, res) => {
    let id = req.query.id;
    let room = await roomService.getRoomById(id);
    res.status(200).json(room);
});

router.post("/room", async (req, res) => {
    let payload = { ...req.body };
    console.log(payload)
    const room = await roomService.addRoom(payload);
    res.status(200).json({ "status": room });
});

router.put("/room", async (req, res) => {
    let id = req.query.id;
    let room = await roomService.editRoom(id, req.body)
    res.status(200).json({ "status": room });
});

router.delete("/room", async (req, res) => {
    console.log(req.query.q)
    let query = req.query.q.split("@")
    let flag = false;

    query.forEach(async (e) => {
        console.log(e)
        flag = await roomService.deleteRoom(e)
    })
    res.status(200).json({ "status": flag });
});

module.exports = router;
