const CourseRepostory = require("../repository/courseRepository");
const { fetchDataById, deleteData, updateData, fetchMatchingDataByField } = require("../repository/firebaseRepository");
const ScheduleRepository = require("../repository/scheduleRepository");
const constants = require("../utils/constants");

const courseRepository = new CourseRepostory();
const scheduleRepository = new ScheduleRepository();

const ScheduleService = class {
  async fetchScheduleByGroupId(id) {
    if (id) {
      let res = await scheduleRepository.fetchScheduleByGroupId(id);
      return res;
    } else {
      throw "Missing id";
    }
  }

  async fetchScheduleByStudentIdAndDateAndTermAndProgrammeAndDepartment(query) {
    if (query.user_id && query.term && query.programme && query.department && query.startDate && query.endDate) {
      let res = await scheduleRepository.fetchScheduleByStudentIdAndDateAndTermAndProgrammeAndDepartment(query.user_id, query.startDate, query.endDate, query.term, query.programme, query.department);
      return res;
    } else {
      throw "Missing parameters";
    }
  }

  async fetchScheduleByLecturerIdAndDateAndTermAndProgrammeAndDepartment(query) {
    if (query.user_id && query.term && query.programme && query.department && query.startDate && query.endDate) {
      let res = await scheduleRepository.fetchScheduleByLecturerIdAndDateAndTermAndProgrammeAndDepartment(query.user_id, query.startDate, query.endDate, query.term, query.programme, query.department);
      return res;
    } else {
      throw "Missing parameters";
    }
  }

  async fetchParticipantsByGroupId(id) {
    if (id) {
      let result = await scheduleRepository.fetchParticipantsByGroupId(id);
      if (result.length < 1) {
        throw "This group has no participants";
      } else {
        return result;
      }
    } else {
      throw "Missing group id";
    }
  }

  async checkAttendance(attendance_report) {
    return await scheduleRepository.checkAttendance(attendance_report);
  }

  async validSchedule(date, room, user_id) {
    let slot = scheduleRepository.fetchScheduleByDateAndRoom(date, room, user_id);
    return slot.length === 0;
  }

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

  async fetchAllGroups() {
    return await courseRepository.fetchAllGroups();
  }

  async fetchGroupsByProgrammeAndTerm(programme, term, department) {
    let groups = await scheduleRepository.fetchGroupsByProgrammeAndTermAndDepartment(programme, term, department);
    groups.forEach((group) => {
      (group.programme = programme), (group.term = term), (group.department = department);
    });
    return groups;
  }

  async addGroupAndCreateSchedules(data) {
    if (!data.programme || !data.term || !data.department || !data.name) {
      throw "Missing parameter";
    }

    let d_id = data.programme + "-" + data.term + "-" + data.department + "-" + data.name;
    data.id = d_id;
    await courseRepository.addGroup(data);

    if (data.slots > 0) {
      let schedules = await this.createSchedulesUsingDayAndSlotAndStartAndEndDate(data.slot, data.startDate, data.endDate, data.slots);
      schedules.forEach(async (schedule, index) => {
        await scheduleRepository.setSchedule(d_id + "-index", {
          session: index,
          date: schedule.date,
          slot: schedule.slot,
          room: "N/A",
          lecturer: data.lecturer,
          course_id: d_id,
        });
      });
    }
    return true;
  }

  async createSchedulesUsingDayAndSlotAndStartAndEndDate(slot, startDate, endDate, maxSlots) {
    let schedules = [];
    let start = new Date(startDate);
    let end = new Date(endDate);
    let schedule = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    while (schedule <= end) {
      for (let s of slot) {
        if (s.day === schedule.getDay()) {
          if (schedules.length >= maxSlots) {
            return schedules;
          } else {
            schedules.push({
              date: schedule.getTime(),
              slot: s.number,
            });
          }
        }
      }
      schedule.setDate(schedule.getDate() + 1);
    }
    return schedules;
  }

  async fetchAllAttendancesByScheduleId(id) {
    return scheduleRepository.fetchAllAttendancesByScheduleId(id);
  }
};

module.exports = { ScheduleService };
