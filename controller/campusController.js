const express = require("express");
const { fetchAllData, fetchMatchingDataByField } = require("../repository/firebaseRepository");
const constants = require("../utils/constants");
const RoomService = require("../services/roomService");
const CampusService = require("../services/campusService");
const { containsRole } = require("../middleware/tokenCheck");
const router = express.Router();

const roomService = new RoomService();
const campusService = new CampusService();

router.get("/", async (req, res) => {
  try {
    let data = await fetchAllData(constants.CAMPUS_TABLE);
    console.log(data)
    res.status(200).json({
      status: true,
      data: data
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      error: e.toString(),
    });
  }
});

router.post("/", async (req, res) => {
  try {
    let payload = req.body;
    let result = await campusService.addCampus(payload);
    res.status(200).json(result);
  } catch (e) {
    res.status(200).json({
      status: false,
      error: e.toString(),
    });
  }
});

router.delete("/", async (req, res) => {
  try {
  } catch (e) {
    let id = req.query.id;
    let result = await campusService.deleteCampus(id);
    res.status(200).json(result);
    res.status(200).json({
      status: false,
      error: e.toString(),
    });
  }
});

router.put("/", async (req, res) => { });

router.get("/rooms", async (req, res) => {
  try {
    let rooms = await roomService.fetchAllRooms();
    console.log("rooms: ")
    console.log(rooms)
    res.status(200).json({
      status: true,
      data: rooms ?? [],
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      error: e.toString(),
    });
  }
});

router.get("/room/:id", async (req, res) => {
  try {
    let id = req.query.id;
    let room = await roomService.getRoomById(id);
    res.status(200).json(room);
  } catch (e) {
    res.status(200).json({
      status: false,
      error: e.toString(),
    });
  }
});

router.post("/room", async (req, res) => {
  try {
    let payload = { ...req.body, status: true };
    console.log(payload);
    const room = await roomService.addRoom(payload);
    res.status(200).json({ status: room });
  } catch (e) {
    res.status(200).json({
      status: false,
      error: e.toString(),
    });
  }
});

router.put("/room", async (req, res) => {
  try {
    let id = req.query.id;
    let room = await roomService.editRoom(id, req.body);
    res.status(200).json({ status: room });
  } catch (e) {
    res.status(200).json({
      status: false,
      error: e.toString(),
    });
  }
});

router.delete("/room", async (req, res) => {
  try {
    console.log(req.query.q);
    let query = req.query.q.split("@");
    let flag = false;

    query.forEach(async (e) => {
      console.log(e);
      flag = await roomService.editRoom(e, { status: false });
      console.log(flag)
    });
    res.status(200).json({
      status: true,
      data: flag
    });
  } catch (e) {
    console.log(e.toString())
    res.status(200).json({
      status: false,
      data: e.toString(),
    });
  }
});

router.delete("/room/hard", containsRole(3), async (req, res) => {
  try {
    console.log(req.query.q);
    let query = req.query.q.split("@");
    let flag = false;

    query.forEach(async (e) => {
      console.log(e);
      flag = await roomService.deleteRoom(e);
    });
    res.status(200).json({ status: flag });
  } catch (e) {
    res.status(200).json({
      status: false,
      error: e.toString(),
    });
  }
});

module.exports = router;
