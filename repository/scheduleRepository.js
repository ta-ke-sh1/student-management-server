const constants = require("../utils/constants");
const { db, addData, updateData, snapshotToArray } = require("./firebaseRepository");

module.exports = class ScheduleRepository {

  async fetchGroupsByProgrammeAndTermAndDepartment(programme, term, department) {
    let snapshot = await db
      .collection(constants.PROGRAMME_TABLE)
      .doc(programme)
      .collection(constants.TERMS_TABLE)
      .doc(term)
      .collection(constants.DEPARTMENTS_TABLE)
      .doc(department)
      .collection(constants.CLASS_TABLE)
      .get();

    return snapshotToArray(snapshot);
  }

  async fetchScheduleByGroupIdAndDateAndTermAndProgrammeAndDepartment(id, programme, term, department) {
    let snapshot = await db
      .collection(constants.PROGRAMME_TABLE)
      .doc(programme)
      .collection(constants.TERMS_TABLE)
      .doc(term)
      .collection(constants.DEPARTMENTS_TABLE)
      .doc(department)
      .collection(constants.CLASS_TABLE)
      .doc(id).collection(constants.SCHEDULE_SLOTS_TABLE)
      .get();

    return snapshotToArray(snapshot);
  }

  async fetchScheduleByLecturerIdAndDateAndTermAndProgrammeAndDepartment(user_id, startDate, endDate, term, programme, department, group) {
    let snapshot = await db
      .collection(constants.PROGRAMME_TABLE)
      .doc(programme)
      .collection(constants.TERMS_TABLE)
      .doc(term)
      .collection(constants.DEPARTMENTS_TABLE)
      .doc(department)
      .collection(constants.CLASS_TABLE)
      .doc(group)
      .collection(constants.SCHEDULE_SLOTS_TABLE)
      .where("lecturer", "==", user_id)
      .where("date", ">=", startDate)
      .where("date", "<=", endDate)
      .get();

    return snapshotToArray(snapshot);
  }

  async fetchScheduleByStudentIdAndDateAndTermAndProgrammeAndDepartment(user_id, startDate, endDate, term, programme, department, group) {
    let snapshot = await db
      .collection(constants.PROGRAMME_TABLE)
      .doc(programme)
      .collection(constants.TERMS_TABLE)
      .doc(term)
      .collection(constants.DEPARTMENTS_TABLE)
      .doc(department)
      .collection(constants.CLASS_TABLE)
      .doc(group)
      .collection(constants.SCHEDULE_SLOTS_TABLE)
      .where("user_id", "==", user_id)
      .where("date", ">=", startDate)
      .where("date", "<=", endDate)
      .get();

    return snapshotToArray(snapshot);
  }

  async fetchScheduleByGroupIdAndTermAndProgrammeAndDepartment(id, term, programme, department) {
    let snapshot = await db
      .collection(constants.PROGRAMME_TABLE)
      .doc(programme)
      .collection(constants.TERMS_TABLE)
      .doc(term)
      .collection(constants.DEPARTMENTS_TABLE)
      .doc(department)
      .collection(constants.CLASS_TABLE)
      .doc(id)
      .collection(constants.SCHEDULE_SLOTS_TABLE)
      .get();


    return snapshotToArray(snapshot);
  }

  async fetchParticipantsByIdAndTermAndProgrammeAndDepartment(id, term, programme, department) {
    let snapshot = await db
      .collection(constants.PROGRAMME_TABLE)
      .doc(programme)
      .collection(constants.TERMS_TABLE)
      .doc(term)
      .collection(constants.DEPARTMENTS_TABLE)
      .doc(department)
      .collection(constants.CLASS_TABLE)
      .doc(id)
      .collection(constants.PARTICIPANTS_TABLE)
      .get();


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
        let ref = db.collection(constants.PROGRAMME_TABLE).doc(programme).collection(constants.TERMS_TABLE).doc(term).collection(constants.DEPARTMENTS_TABLE).doc(department).collection(constants.SCHEDULE_SLOTS_TABLE).doc(report.attendance[i].student_id);

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
    let ref = db.collection(constants.PROGRAMME_TABLE).doc(programme).collection(constants.TERMS_TABLE).doc(term).collection(constants.DEPARTMENTS_TABLE).doc(department).collection(constants.SCHEDULE_SLOTS_TABLE).doc(id);

    await ref.update({
      attendance_status: status,
    });
  }
};
