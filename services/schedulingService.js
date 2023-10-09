const CourseRepostory = require("../repository/courseRepository");
const { fetchDataById, addData, deleteData, setData, updateData, fetchMatchingDataByField } = require("../repository/firebaseRepository");
const ScheduleRepository = require("../repository/scheduleRepository");
const constants = require("../utils/constants");

const courseRepository = new CourseRepostory();
const scheduleRepository = new ScheduleRepository();

const ScheduleService = class {
  async fetchScheduleByUserIdAndTermAndProgrammeAndDepartment(id, term, programme, department) {
    if (id && term && programme && department) {
      let result = await courseRepository.fetchScheduleByIdAndTermAndProgrammeAndDepartment(id, term, programme, department);
      console.log("Result:");
      console.log(result);
      return {
        status: true,
        data: result,
      };
    } else {
      return {
        status: false,
        data: "Missing parameters",
      };
    }
  }

  async fetchScheduleByIdAndTermAndProgrammeAndDepartment(id, term, programme, department) {
    if (id && term && programme && department) {
      let result = await courseRepository.fetchScheduleByIdAndTermAndProgrammeAndDepartment(id, term, programme, department);
      console.log("Result:");
      console.log(result);
      return {
        status: true,
        data: result,
      };
    } else {
      return {
        status: false,
        data: "Missing parameters",
      };
    }
  }

  async fetchParticipantsByIdAndTermAndProgrammeAndDepartment(id, term, programme, department) {
    if (id && term && programme && department) {
      let result = await courseRepository.fetchParticipantsByIdAndTermAndProgrammeAndDepartment(id, term, programme, department);
      console.log("Result:");
      console.log(result);
      return {
        status: true,
        data: result,
      };
    } else {
      return {
        status: false,
        data: "Missing parameters",
      };
    }
  }

  async fetchGroupsByProgrammeAndTerm(programme, term, department) {
    try {
      let groups = await courseRepository.fetchGroupsByProgrammeAndTermAndDepartment(programme, term, department);
      console.log(groups);
      return {
        status: true,
        data: groups,
      };
    } catch (e) {
      return {
        status: false,
        error: e,
      };
    }
  }

  async addGroup(data) {
    return await courseRepository.addGroupBySemester(data);
  }

  async validSchedule(date, room, user_id) {
    let slot = courseRepository.fetchScheduleByDateAndRoom(date, room, user_id);
    return slot.length === 0;
  }

  async reserveSchedule() {}

  async fetchAllSchedules(campus) {
    const schedules = await fetchMatchingDataByField(constants.SCHEDULE_SLOTS_TABLE, "campus", campus);
    return schedules;
  }

  async editSchedule(Schedule_id, Schedule_obj) {
    const res = await updateData(constants.SCHEDULE_SLOTS_TABLE, Schedule_id, Schedule_obj);
    return res;
  }

  async deleteSchedule(Schedule_id) {
    const res = await deleteData(constants.SCHEDULE_SLOTS_TABLE, Schedule_id);
    return res;
  }

  async addSchedule(Schedule_obj) {
    const res = await scheduleRepository;
    return res;
  }

  async fetchScheduleById(Schedule_id) {
    if (!Schedule_id) {
      return {
        error: "Invalid Schedule id!",
      };
    }
    let schedule = await fetchDataById(constants.SCHEDULE_SLOTS_TABLE, Schedule_id);
    if (schedule === -1) {
      return {
        error: "Schedule does not exist",
      };
    }
    return schedule;
  }
};

module.exports = { ScheduleService };
