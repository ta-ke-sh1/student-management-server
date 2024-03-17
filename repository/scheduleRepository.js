const constants = require("../utils/constants");
const { db, addData, updateData, snapshotToArray, setData, fetchAllData, fetchMatchingDataByField, fetchDataById } = require("./firebaseRepository");

module.exports = class ScheduleRepository {
  constructor() {

  }

  async fetchScheduleByGroupId(id) {
    console.log("Repository")
    console.log(id)
    let snapshot = await fetchMatchingDataByField(constants.SCHEDULE_SLOTS_TABLE, "course_id", id)

    console.log(snapshot)
    return await snapshotToArray(snapshot);
  }

  async fetchScheduleByLecturerIdAndDateAndTermAndProgrammeAndDepartment(user_id, startDate, endDate, term, programme, department, group) {
    let snapshot = await db
      .collection(constants.SCHEDULE_SLOTS_TABLE)
      .where("term", "==", term)
      .where("programme", "==", programme)
      .where("department", "==", department)
      .where("group", "==", group)
      .where("lecturer", "==", user_id)
      .where("date", ">=", startDate)
      .where("date", "<=", endDate)
      .get();

    return await snapshotToArray(snapshot);
  }

  async fetchScheduleByStudentIdAndDate(student_id, startDate, endDate) {
    let snapshots = await db
      .collection(constants.SCHEDULE_SLOTS_TABLE)
      .where("course_id", "==", course_id)
      .get();

    let data = await snapshotToArray(snapshots)

    let schedules = data.filter(s => s.date >= parseInt(startDate) && s.date <= parseInt(endDate));

    const slots = [];

    for (const schedule of schedules) {
      let schedule_slot = await fetchDataById(constants.ATTENDANCES_TABLE, schedule.id + "-" + student_id);
      const group = schedule.course_id.split("-");
      const _class = group[group.length - 1]

      if (schedule_slot === -1) {
        slots.push({
          slot_id: schedule.id,
          student_id: student_id,
          status: -1,
          slot: schedule.slot,
          date: schedule.date,
          room: schedule.room,
          lecturer: schedule.lecturer,
          course_id: schedule.course_id,
          class: _class,
          subject: schedule.subject
        })
      } else {
        schedule.student_id = student_id
        schedule.status = schedule_slot.status
        schedule.class = _class
        schedule.group = group[group.length - 1]
        slots.push(schedule)
      }
    };

    return slots;
  }

  async fetchScheduleByStudentIdAndCourseIdAndDate(student_id, course_id, startDate, endDate) {
    let snapshots = await db
      .collection(constants.SCHEDULE_SLOTS_TABLE)
      .where("course_id", "==", course_id)
      .get();

    let data = await snapshotToArray(snapshots)

    console.log(data)

    let schedules = data.filter(s => s.date >= parseInt(startDate) && s.date <= parseInt(endDate));

    const slots = [];

    for (const schedule of schedules) {
      let schedule_slot = await fetchDataById(constants.ATTENDANCES_TABLE, schedule.id + "-" + student_id);
      const group = schedule.course_id.split("-");
      const _class = group[group.length - 1]

      if (schedule_slot === -1) {
        slots.push({
          slot_id: schedule.id,
          student_id: student_id,
          status: -1,
          slot: schedule.slot,
          date: schedule.date,
          room: schedule.room,
          lecturer: schedule.lecturer,
          course_id: schedule.course_id,
          class: _class,
          subject: schedule.subject
        })
      } else {
        schedule.student_id = student_id
        schedule.status = schedule_slot.status
        schedule.class = _class
        schedule.group = group[group.length - 1]
        slots.push(schedule)
      }
    };

    return slots;
  }

  async fetchScheduleByGroupId(group_id) {
    let snapshot = await db.collection(constants.SCHEDULE_SLOTS_TABLE).where("group_id", "==", group_id).get();

    return snapshotToArray(snapshot);
  }

  async fetchParticipantsByGroupId(group_id) {
    let snapshot = await db.collection(constants.COURSES_REGISTRATION_TABLE).where("group_id", "==", group_id).get();
    return snapshotToArray(snapshot);
  }

  async fetchSchedules() {
    return await fetchAllData(constants.SCHEDULE_SLOTS_TABLE);
  }

  async fetchScheduleById(id) {
    return await fetchDataById(constants.SCHEDULE_SLOTS_TABLE, id);
  }

  async setSchedule(id, document) {
    return await setData(constants.SCHEDULE_SLOTS_TABLE, id, document);
  }

  async addSchedule(document) {
    return await addData(constants.SCHEDULE_SLOTS_TABLE, document);
  }

  async updateSchedule(id, document) {
    return await updateData(constants.SCHEDULE_SLOTS_TABLE, id, document);
  }

  async deleteSchedule(id) {
    return await updateData(constants.SCHEDULE_SLOTS_TABLE, id, { status: false });
  }

  async deleteHardSchedule(id) {
    return await deleteData(constants.SCHEDULE_SLOTS_TABLE, id);
  }

  async fetchAllAttendancesByScheduleId(id) {
    let splitted = id.split("-")

    const session = splitted[splitted.length - 1];
    const group_id = splitted.slice(0, -1).join("-")

    console.log(session)
    console.log(splitted)

    let result = await db.collection(constants.ATTENDANCES_TABLE).where("group_id", "==", group_id).where("session", "==", parseInt(session)).get();
    return snapshotToArray(result)
  }

  async checkAttendance(report) {
    if (!report.attendance || !Array.isArray(report.attendance)) {
      throw "Invalid attendance report format!";
    }
    for (let i = 0; i < report.attendance.length; i++) {
      try {
        let ref = db.collection(constants.ATTENDANCES_TABLE).doc(report.attendance[i].id);

        await ref.update({
          remark: parseInt(report.attendance[i].remark),
        });
      } catch (e) {
        throw e;
      }
    }

    return "All attendance tickets checked!";
  }

  async editAttendance(id, status) {
    let ref = db.collection(constants.SCHEDULE_SLOTS_TABLE).doc(id);

    await ref.update({
      attendance_status: status,
    });
  }

  async deleteSchedules(schedules) {
    for (const i in schedules) {
      await db.collection(constants.SCHEDULE_SLOTS_TABLE).doc(schedules[i]).delete()
    }
  }

  async deleteParticipantFromGroup(groupId, studentId) {
    const groupRef = db.collection(constants.COURSES_REGISTRATION_TABLE).doc(groupId)
    await groupRef.delete()

    const docs = await db.collection(constants.ATTENDANCES_TABLE).where("student_id", "==", studentId).get()
    docs.forEach(element => {
      element.ref.delete();
      console.log(`deleted: ${element.id}`);
    });
  }
};
