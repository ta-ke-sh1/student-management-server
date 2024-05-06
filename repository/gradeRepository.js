const constants = require("../utils/constants");
const { deleteData, updateData, fetchAllData, db, snapshotToArray } = require("./firebaseRepository");

module.exports = class GradeRepository {
  async fetchAllGrades() {
    return await fetchAllData(constants.GRADE_TABLE);
  }

  async fetchAllGradesByStudentId(id) {
    let snapshots = await db.collection(constants.COURSES_REGISTRATION_TABLE).where("student_id", "==", id).get();
    return snapshotToArray(snapshots);
  }

  async fetchAllGradesByStudentIdAndSemester(id, semester) {
    let snapshots = await db.collection(constants.GRADE_TABLE).where("student", "==", id).where("semester", "==", semester).get();
    return snapshotToArray(snapshots);
  }

  async fetchAllGradesByStudentIdAndTermAndProgrammeAndDepartmentAndGroup(id, term, programme, department, group) {
    let snapshots = await db.collection(constants.GRADE_TABLE).where("student", "==", id).where("semester", "==", semester).where("term", "==", term).where("programme", "==", programme).where("department", "==", department).where("group", "==", group).get();
    return snapshotToArray(snapshots);
  }

  async fetchGradingByStudentIdAndCourseId(student_id, course_id) {
    let snapshots = await db
      .collection(constants.SUBMISSIONS_TABLE)
      .where('course_id', '==', course_id)
      .where('user_id', '==', student_id)
      .get();

    return snapshotToArray(snapshots);
  }

  async submitGrade(document) {
    return await db.collection(constants.SUBMISSIONS_TABLE).doc(document.id).update({
      grade: parseInt(document.grade),
      gradeText: document.gradeText,
      comments: document.comments,
    })
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
