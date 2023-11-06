const CourseRepostory = require("../repository/courseRepository");
const { fetchDataById, deleteData, updateData, fetchMatchingDataByField, db } = require("../repository/firebaseRepository");
const ScheduleRepository = require("../repository/scheduleRepository");
const constants = require("../utils/constants");


const ScheduleService = class {

  constructor() {
    this.courseRepository = new CourseRepostory();
    this.scheduleRepository = new ScheduleRepository();
  }

  async fetchScheduleByGroupId(id) {
    if (!id) {
      throw "Missing id";
    } else {
      console.log("Service:")
      console.log(id)
      let res = await fetchMatchingDataByField(constants.SCHEDULE_SLOTS_TABLE, "course_id", id);
      return res;
    }
  }

  async fetchScheduleByStudentIdAndDate(query) {
    if (query.user_id && query.startDate && query.endDate && query.course_id) {
      let courses = query.course_id.split("%")

      let results = [];
      for (const course of courses) {
        if (course != "") {
          const data = await this.scheduleRepository.fetchScheduleByStudentIdAndCourseIdAndDate(query.user_id, course, query.startDate, query.endDate);

          for (const d of data) {
            results.push(d)
          }
        }
      }

      console.log(results)
      return results;
    } else {
      throw "Missing parameters";
    }
  }

  async fetchScheduleByLecturerIdAndDateAndTermAndProgrammeAndDepartment(query) {
    console.log(query)
    if (query.user_id && query.term && query.programme && query.department && query.startDate && query.endDate) {
      let res = await this.scheduleRepository.fetchScheduleByLecturerIdAndDateAndTermAndProgrammeAndDepartment(query.user_id, query.startDate, query.endDate, query.term, query.programme, query.department);
      console.log(res)
      return res;
    } else {
      throw "Missing parameters";
    }
  }

  async fetchParticipantsByGroupId(id) {
    if (id) {
      let result = await this.scheduleRepository.fetchParticipantsByGroupId(id);
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
    return await this.scheduleRepository.checkAttendance(attendance_report);
  }

  async validSchedule(date, room, user_id) {
    let slot = this.scheduleRepository.fetchScheduleByDateAndRoom(date, room, user_id);
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
    const res = await this.courseRepository.addGroupBySemester(data);
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

  async addParticipantToGroup(data) {
    const group = data.group
    const participants = data.participants

    const schedules = await this.fetchScheduleByGroupId(group.id);
    console.log(schedules)

    for (const j in participants) {
      await db.collection(constants.COURSES_REGISTRATION_TABLE).doc(group.id + "-" + participants[j].id).set({
        status: true,
        group_id: group.id,
        student_id: participants[j].id,
      })

      for (let i = 0; i < schedules.length; i++) {
        await db.collection(constants.ATTENDANCES_TABLE).doc(group.id + "-" + participants[j].id + "-session" + schedules[i].session).set({
          group_id: group.id,
          dob: participants[j].dob,
          student_id: participants[j].id,
          session: schedules[i].session,
          date: schedules[i].date,
          status: true,
          remark: -1,
        });
      }
    }
  }

  async fetchAllGroups() {
    return await this.courseRepository.fetchAllGroups();
  }

  async fetchGroupsByProgrammeAndTerm(programme, term, department) {
    let groups = await this.scheduleRepository.fetchGroupsByProgrammeAndTermAndDepartment(programme, term, department);
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
    console.log(data);
    let slot = data.slot;

    await this.courseRepository.addGroup(data);

    if (data.slots > 0) {
      let schedules = await this.createSchedulesUsingDayAndSlotAndStartAndEndDate(slot, data.startDate * 1000, data.endDate * 1000, data.slots);
      schedules.forEach(async (schedule, index) => {
        await this.scheduleRepository.setSchedule(d_id + "-" + index, {
          session: index,
          date: schedule.date,
          slot: schedule.slot,
          room: "N/A",
          lecturer: data.lecturer,
          course_id: d_id,
          subject: data.subject,
          status: true,
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
        if (s.number === schedule.getDay()) {
          if (schedules.length >= maxSlots) {
            return schedules;
          } else {
            schedules.push({
              date: schedule.getTime(),
              slot: s.slot,
            });
          }
        }
      }
      schedule.setDate(schedule.getDate() + 1);
    }
    return schedules;
  }

  async fetchAllAttendancesByScheduleId(id) {
    return this.scheduleRepository.fetchAllAttendancesByScheduleId(id);
  }

  async updateGroup(id, data) {
    delete data.slot
    delete data.dayOfTheWeek
    return this.courseRepository.updateGroup(id, data)
  }
};

module.exports = { ScheduleService };
