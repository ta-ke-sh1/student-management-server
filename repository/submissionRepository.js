const constants = require("../utils/constants");
const { addData, deleteData, updateData, fetchAllData, db } = require("./firebaseRepository");

module.exports = class SubmissionRepository {
  async fetchSubmissions() {
    return await fetchAllData(constants.SUBMISSIONS_TABLE);
  }

  async fetchSubmissionByTermAndProgrammeAndDepartmentAndGroup(term, programme, department, group) {
    let snapshot = await db.collection(constants.PROGRAMME_TABLE).doc(programme).collection(constants.TERMS_TABLE).doc(term).collection(constants.DEPARTMENTS_TABLE).doc(department).collection(constants.CLASS_TABLE).doc(group).collection(constants.SUBMISSIONS_TABLE).get();

    if (snapshot.empty) {
      throw "No matching documents";
    }

    return snapshotToArray(snapshot);
  }

  async fetchSubmissionByCourseIdAndUserAndAssignmentId(id, user, asm) {
    let snapshots = await db.collection(constants.COURSES_REGISTRATION_TABLE).doc(id).collection(constants.SUBMISSIONS_TABLE).doc(asm).collection("Submissions").doc(user).get();
    return {
      id: snapshots.id,
      ...snapshots.data(),
    };
  }

  async submitSubmission(document) {
    return await addData(constants.SUBMISSIONS_TABLE, document);
  }

  async updateSubmission(id, document) {
    return await updateData(constants.SUBMISSIONS_TABLE, id, document);
  }

  async deleteSubmission(id) {
    return await updateData(constants.SUBMISSIONS_TABLE, id, { status: false });
  }

  async deleteHardSubmission(id) {
    return await deleteData(constants.SUBMISSIONS_TABLE, id);
  }

  async uploadSubmission(course, submissionFile) {}
};
