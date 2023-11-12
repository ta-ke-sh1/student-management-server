const constants = require("../utils/constants");
const { addData, deleteData, updateData, fetchAllData, db, snapshotToArray } = require("./firebaseRepository");

module.exports = class RequestRepository {
  async fetchRequest() {
    return await fetchAllData(constants.REQUEST_TABLE);
  }

  async fetchUserRequests(id) {
    let snapshots = await db.collection(constants.REQUEST_TABLE).where("user_id", "==", id).get();
    return snapshotToArray(snapshots)
  }

  async updateRequest(id, request) {
    return await updateData(constants.REQUEST_TABLE, id, request);
  }

  async addRequest(request) {
    return await addData(constants.REQUEST_TABLE, request);
  }

  async editRequest(id, request) {
    return await updateData(constants.REQUEST_TABLE, id, request);
  }

  async deleteRequest(id) { }

  async deleteHardRequest(id) {
    return await deleteDataData(constants.REQUEST_TABLE, id);
  }
};
