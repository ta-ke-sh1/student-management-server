const {
    fetchDataById,
    addData,
    deleteData,
    setData,
    updateData,
    fetchMatchingDataByField,
} = require("../repository/firebaseRepository");
const RoomRepository = require("../repository/roomBookingRepository");
const constants = require("../utils/constants");

const roomRepository = new RoomRepository();

const RoomService = class {
    async reserveRoom(data) {
        let slot = {
            subject: data.subject_id,
            room: data.room_id,
            date: data.date,
            slot: data.slot,
            lecture: data.lecture_id,
            class: data.class_id,
        };
        if (utils.isNonEmptyObject(slot)) {
            return {
                error: "Invalid object: contains null",
            };
        } else {
            return roomRepository.bookRoom(slot);
        }
    }

    async fetchAllRoomsByCampus(campus) {
        const rooms = await fetchMatchingDataByField(
            constants.ROOMS_TABLE,
            "campus",
            campus
        );
        return rooms;
    }

    async editRoom(room_id, data) {
        const res = await updateData(constants.ROOMS_TABLE, room_id, {
            ...data
        });
        return res;
    }

    async deleteRoom(room_id) {
        const res = await deleteData(constants.ROOMS_TABLE, room_id);
        return res;
    }

    async addRoom(data) {
        const res = await setData(constants.ROOMS_TABLE, "Room-" + data.campus + "-" + data.building + "-" + data.number, data)
        return res;
    }

    async fetchRoomById(room_id) {
        if (!room_id) {
            return {
                error: "Invalid room id!",
            };
        }
        let room = await fetchDataById(constants.ROOMS_TABLE, room_id);
        if (room === -1) {
            return {
                error: "Room does not exist",
            };
        }
        return room;
    }
};

module.exports = RoomService;
