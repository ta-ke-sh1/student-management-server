const { fetchDataById, addData, deleteData, setData, updateData, fetchMatchingDataByField } = require("../repository/firebaseRepository")
const constants = require("../utils/constants");

const ScheduleService = class {

    async validSchedule() {

    }

    async reserveSchedule() {

    }

    async getAllSchedules(campus) {
        const schedules = await fetchMatchingDataByField(constants.SCHEDULE_SLOTS_TABLE, "campus", campus)
        return schedules;
    }

    async editSchedule(Schedule_id, Schedule_obj) {
        const res = await updateData(constants.SCHEDULE_SLOTS_TABLE, Schedule_id, Schedule_obj)
        return res;
    }

    async deleteSchedule(Schedule_id) {
        const res = await deleteData(constants.SCHEDULE_SLOTS_TABLE, Schedule_id)
        return res;
    }

    async addSchedule(Schedule_obj) {
        const res = await addData(constants.SCHEDULE_SLOTS_TABLE, Schedule_obj)
        return res;
    }

    async getScheduleById(Schedule_id) {
        if (!Schedule_id) {
            return {
                error: "Invalid Schedule id!"
            }
        }
        let schedule = await fetchDataById(constants.SCHEDULE_SLOTS_TABLE, Schedule_id);
        if (schedule === -1) {
            return {
                error: "Schedule does not exist"
            }
        }
        return schedule;
    }
}

module.exports = { ScheduleService }