const { fetchDataById, addData, deleteData, setData, updateData, fetchMatchingDataByField } = require("../repository/database")
const constants = require("../utils/constants");

const RoomService = class {

    async validRoom() {

    }

    async reserveRoom() {

    }

    async getAllRooms(campus) {
        const rooms = await fetchMatchingDataByField(constants.ROOMS_TABLE, "campus", campus)
        return rooms;
    }

    async editRoom(room_id, room_obj) {
        const res = await updateData(constants.ROOMS_TABLE, room_id, room_obj)
        return res;
    }

    async deleteRoom(room_id) {
        const res = await deleteData(constants.ROOMS_TABLE, room_id)
        return res;
    }

    async addRoom(room_obj) {
        const res = await addData(constants.ROOMS_TABLE, room_obj)
        return res;
    }

    async getRoomById(room_id) {
        if (!room_id) {
            return {
                error: "Invalid room id!"
            }
        }
        let room = await fetchDataById(constants.ROOMS_TABLE, room_id);
        if (room === -1) {
            return {
                error: "Room does not exist"
            }
        }
        return room;
    }
}

module.exports = { RoomService }