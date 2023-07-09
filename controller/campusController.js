const express = require("express");
const { fetchAllData, fetchMatchingDataByField } = require("../repository/firebaseRepository");
const constants = require("../utils/constants");
const { RoomService } = require("../services/roomService");
const router = express.Router();

const roomService = new RoomService();

router.get("/", async (req, res) => {
    let docs = await fetchAllData(constants.CAMPUS_TABLE);
    res.status(200).json(docs);
});

router.post("/", async (req, res) => {

});

router.delete("/", async (req, res) => {

});

router.put("/", async (req, res) => {

});

router.get("/:id/room", async (req, res) => {
    let id = req.params['id'];
    let rooms = await roomService.getAllRoomsByCampus(id)
    res.status(200).json(rooms);
});

router.get("/room", async (req, res) => {
    let id = req.query.id;
    let room = await roomService.getRoomById(id)
    res.status(200).json(room)
})

router.post("/:id/room", async (req, res) => {
    let id = req.query.id;
    let payload = { id, ...req.body }
    let room = await roomService.addRoom()
    res.status(200).json(room)
})

router.put("/room", async (req, res) => {
    let id = req.query.id;
    let room = await roomService.getRoomById(id)
    res.status(200).json(room)
})

router.delete("/room", async (req, res) => {
    let id = req.query.id;
    let room = await roomService.getRoomById(id)
    res.status(200).json(room)
})


module.exports = router;
