const constants = require("../utils/constants");
const { addData, deleteData, updateData, fetchAllData, fetchDataById } = require("./firebaseRepository");

module.exports = class SubmissionRepository {
  async fetchSubmissions() {
    return await fetchAllData(constants.SUBMISSIONS_TABLE);
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

  async uploadSubmission(course, submissionFile) {}
};
