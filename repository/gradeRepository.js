const constants = require("../utils/constants");
const { addData, deleteData, updateData, fetchAllData, fetchDataById, fetchMatchingDataByField, db, snapshotToArray } = require("./firebaseRepository");

module.exports = class GradeRepository {
  async fetchAllGrades() {
    return await fetchAllData(constants.GRADE_TABLE);
  }

  async fetchAllGradesByStudentId(id) {
    return await fetchMatchingDataByField(constants.GRADE_TABLE, "student", id);
  }

  async fetchAllGradesByStudentIdAndSemester(id, semester) {
    let snapshots = await db.collection(constants.GRADE_TABLE).where("student", "==", id).where("semester", "==", semester).get();
    return snapshotToArray(snapshots);
  }

  async fetchAllGradesByStudentIdAndTermAndProgrammeAndDepartmentAndGroup(id, term, programme, department, group) {
    let snapshots = await db.collection(constants.GRADE_TABLE).where("student", "==", id).where("semester", "==", semester).where("term", "==", term).where("programme", "==", programme).where("department", "==", department).where("group", "==", group).get();
    return snapshotToArray(snapshots);
  }

  async submitGrade(document) {
    return await addData(constants.GRADE_TABLE, document);
  }

  async updateGrade(id, update_grade_obj) {
    return await updateData(constants.GRADE_TABLE, id, update_grade_obj);
  }

  async deleteGrade(id) {
    return await updateData(constants.GRADE_TABLE, id, { status: false });
  }

  async deleteHardGrade(id) {
    return await deleteData(constants.GRADE_TABLE, id);
  }
};
