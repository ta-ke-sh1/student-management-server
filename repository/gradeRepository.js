const constants = require("../utils/constants");
const { addData, deleteData, updateData, fetchAllData, fetchDataById } = require("./firebaseRepository");

module.exports = class GradeRepository {
  async fetchGrades() {
    return await fetchAllData(constants.SUBMISSIONS_TABLE);
  }

  async fetchGradeById(id) {
    return await fetchDataById(constants.SUBMISSIONS_TABLE, id);
  }

  async submitGrade(document) {
    return await addData(constants.SUBMISSIONS_TABLE, document);
  }

  async updateGrade(id, document) {
    return await updateData(constants.SUBMISSIONS_TABLE, id, document);
  }

  async deleteGrade(id) {
    return await updateData(constants.SUBMISSIONS_TABLE, id, { status: false });
  }

  async deleteHardGrade(id) {
    return await deleteData(constants.SUBMISSIONS_TABLE, id);
  }

  async uploadSubmission(course, submissionFile) {}
};
