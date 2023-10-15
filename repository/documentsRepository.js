const constants = require("../utils/constants");
const { addData, deleteData, updateData, fetchAllData, fetchDataById } = require("./firebaseRepository");

module.exports = class DocumentsRepository {
  async fetchDocuments() {
    return await fetchAllData(constants.SUPPORT_DOCUMENTS_TABLE);
  }

  async fetchDocumentById(id) {
    return await fetchDataById(constants.SUPPORT_DOCUMENTS_TABLE, id);
  }

  async addDocument(document) {
    return await addData(constants.SUPPORT_DOCUMENTS_TABLE, document);
  }

  async updateDocument(id, document) {
    return await updateData(constants.SUPPORT_DOCUMENTS_TABLE, id, document);
  }

  async deleteDocument(id) {
    return await updateData(constants.SUPPORT_DOCUMENTS_TABLE, id, { status: false });
  }

  async deleteHardDocument(id) {
    return await deleteData(constants.SUPPORT_DOCUMENTS_TABLE, id);
  }

  async uploadSubmission(course, submissionFile) { }
};
