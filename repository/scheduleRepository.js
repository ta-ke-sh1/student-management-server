const constants = require("../utils/constants");
const { db, addData, updateData, snapshotToArray } = require("./firebaseRepository");

module.exports = class ScheduleRepository {

  async fetchScheduleByGroupId(id) {
    let snapshot = await db.collection(constants.SCHEDULE_SLOTS_TABLE).where("group_id", "==", group_id).get();
    return snapshotToArray(snapshot);
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

    return snapshotToArray(snapshot);
  }

  async fetchScheduleByStudentIdAndDateAndTermAndProgrammeAndDepartment(user_id, startDate, endDate, term, programme, department, group) {
    let snapshot = await db
      .collection(constants.SCHEDULE_SLOTS_TABLE)
      .where("term", "==", term)
      .where("programme", "==", programme)
      .where("department", "==", department)
      .where("group", "==", group)
      .where("user_id", "==", user_id)
      .where("date", ">=", startDate)
      .where("date", "<=", endDate)
      .get();

    return snapshotToArray(snapshot);
  }

  async fetchScheduleByGroupId(group_id) {
    let snapshot = await db.collection(constants.SCHEDULE_SLOTS_TABLE).where("group_id", "==", group_id).get();

    return snapshotToArray(snapshot);
  }

  async fetchParticipantsByGroupId(group_id) {
    let snapshot = await db.collection(constants.PARTICIPANTS_TABLE).where("group_id", "==", group_id).get();
    return snapshotToArray(snapshot);
  }

  async fetchSchedules() {
    return await fetchAllData(constants.SCHEDULE_SLOTS_TABLE);
  }

  async fetchScheduleById(id) {
    return await fetchDataById(constants.SCHEDULE_SLOTS_TABLE, id);
  }

  async submitSchedule(document) {
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

  async checkAttendance(report) {
    if (!report.attendance || Array.isArray(report.attendance)) {
      throw "Invalid attendance report format!";
    }
    for (let i = 0; i < report.attendance.length; i++) {
      try {
        let ref = db.collection(constants.SCHEDULE_SLOTS_TABLE).doc(report.attendance[i].student_id).where("group_id", "==", report.id);

        await ref.update({
          attendance_status: report.attendance[i].attendance_status,
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
};
