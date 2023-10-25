const CourseRepostory = require("../repository/courseRepository");
const { fetchDataById, addData, deleteData, setData, updateData, fetchMatchingDataByField } = require("../repository/firebaseRepository");
const ScheduleRepository = require("../repository/scheduleRepository");
const constants = require("../utils/constants");

const courseRepository = new CourseRepostory();
const scheduleRepository = new ScheduleRepository();

const ScheduleService = class {
  async fetchScheduleByLecturerIdAndDateAndTermAndProgrammeAndDepartment(query) {
    if (query.user_id && query.term && query.programme && query.department && query.startDate && query.endDate) {
      return await scheduleRepository.fetchScheduleByLecturerIdAndDateAndTermAndProgrammeAndDepartment(query.user_id, query.startDate, query.endDate, query.term, query.programme, query.department);
    } else {
      throw "Missing parameters";
    }
  }

  async fetchScheduleByStudentIdAndDateAndTermAndProgrammeAndDepartment(query) {
    if (query.user_id && query.term && query.programme && query.department && query.startDate && query.endDate) {
      return await scheduleRepository.fetchScheduleByStudentIdAndDateAndTermAndProgrammeAndDepartment(query.user_id, query.startDate, query.endDate, query.term, query.programme, query.department);
    } else {
      throw "Missing parameters";
    }
  }

  async fetchScheduleByGroupIdAndTermAndProgrammeAndDepartment(id, term, programme, department) {
    if (id && term && programme && department) {
      return await scheduleRepository.fetchScheduleByGroupIdAndTermAndProgrammeAndDepartment(id, term, programme, department);
    } else {
      throw "Missing parameters";
    }
  }

  async fetchScheduleByIdAndTermAndProgrammeAndDepartment(id, term, programme, department) {
    if (id && term && programme && department) {
      return await scheduleRepository.fetchScheduleByGroupIdAndTermAndProgrammeAndDepartment(id, term, programme, department);
    } else {
      throw "Missing parameters";
    }
  }

  async fetchParticipantsByIdAndTermAndProgrammeAndDepartment(id, term, programme, department) {
    if (id && term && programme && department) {
      return await scheduleRepository.fetchParticipantsByIdAndTermAndProgrammeAndDepartment(id, term, programme, department);
    } else {
      throw "Missing parameters";
    }
  }

  async checkAttendance(attendance_report) {
    return await scheduleRepository.checkAttendance(attendance_report);
  }

  async fetchGroupsByProgrammeAndTerm(programme, term, department) {
    return await scheduleRepository.fetchGroupsByProgrammeAndTermAndDepartment(programme, term, department);
  }

  async addGroup(data) {
    return await courseRepository.addGroupBySemester(data);
  }

  async validSchedule(date, room, user_id) {
    let slot = scheduleRepository.fetchScheduleByDateAndRoom(date, room, user_id);
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

  async addSchedule(data) {
    const res = await courseRepository.addGroupBySemester(data);
    console.log("Schedule service: add schedule");
    console.log(res);
    return res;
  }

  async fetchScheduleById(Schedule_id) {
    if (!Schedule_id) {
      throw "Invalid Schedule id!";
    }
    let schedule = await fetchDataById(constants.SCHEDULE_SLOTS_TABLE, Schedule_id);
    if (schedule === -1) {
      throw "Schedule does not exist";
    }
    return schedule;
  }
};

module.exports = { ScheduleService };
