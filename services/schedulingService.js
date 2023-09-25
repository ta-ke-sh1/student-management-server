const CourseRepostory = require("../repository/courseRepository");
const {
    fetchDataById,
    addData,
    deleteData,
    setData,
    updateData,
    fetchMatchingDataByField,
} = require("../repository/firebaseRepository");
const constants = require("../utils/constants");

const courseRepository = new CourseRepostory();

const ScheduleService = class {

    async fetchGroupsByProgrammeAndTerm(programme, term) {
        try {
            let groups = await courseRepository.fetchGroupsByProgrammeAndTerm(programme, term)
            return {
                status: true,
                data: groups
            }
        } catch (e) {
            return {
                status: false,
                error: e
            }
        }
    }

    async addGroup(programme, term, group) {
        try {
            let groups = await courseRepository.fetchGroupsByProgrammeAndTerm(programme, term)
            return {
                status: true,
                data: groups
            }
        } catch (e) {
            return {
                status: false,
                error: e
            }
        }
    }

    async validSchedule(date, room, user_id) {
        let slot = courseRepository.fetchScheduleByDateAndRoom(
            date,
            room,
            user_id
        );
        return slot.length === 0;
    }

    async reserveSchedule() { }

    async fetchAllSchedules(campus) {
        const schedules = await fetchMatchingDataByField(
            constants.SCHEDULE_SLOTS_TABLE,
            "campus",
            campus
        );
        return schedules;
    }

    async editSchedule(Schedule_id, Schedule_obj) {
        const res = await updateData(
            constants.SCHEDULE_SLOTS_TABLE,
            Schedule_id,
            Schedule_obj
        );
        return res;
    }

    async deleteSchedule(Schedule_id) {
        const res = await deleteData(
            constants.SCHEDULE_SLOTS_TABLE,
            Schedule_id
        );
        return res;
    }

    async addSchedule(Schedule_obj) {
        const res = await addData(constants.SCHEDULE_SLOTS_TABLE, Schedule_obj);
        return res;
    }

    async fetchScheduleById(Schedule_id) {
        if (!Schedule_id) {
            return {
                error: "Invalid Schedule id!",
            };
        }
        let schedule = await fetchDataById(
            constants.SCHEDULE_SLOTS_TABLE,
            Schedule_id
        );
        if (schedule === -1) {
            return {
                error: "Schedule does not exist",
            };
        }
        return schedule;
    }
};

module.exports = { ScheduleService };
