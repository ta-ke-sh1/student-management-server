const constants = require("../utils/constants");
const { addData, deleteData, updateData, fetchAllData, db, fetchDataById } = require("./firebaseRepository");

module.exports = class SubmissionRepository {
  async fetchSubmissions() {
    return await fetchAllData(constants.SUBMISSIONS_TABLE);
  }

  async fetchSubmissionByTermAndProgrammeAndDepartmentAndGroup(term, programme, department, group) {
    let snapshot = await db.collection(constants.SUBMISSIONS_TABLE).where("group", "==", group).get();

    if (snapshot.empty) {
      throw "No matching documents";
    }

    return snapshotToArray(snapshot);
  }

  async fetchSubmissionByCourseIdAndUserAndAssignmentId(group, user, asm) {
    let snapshots = await db.collection(constants.SUBMISSIONS_TABLE).where("group", "==", group).where("assignment_id", "==", asm).get();
    return {
      id: snapshots.id,
      ...snapshots.data(),
    };
  }

  async fetchSubmissionById(id) {
    return await fetchDataById(constants.SUBMISSIONS_TABLE, id);
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

  async uploadSubmission(course, submissionFile) { }
};
