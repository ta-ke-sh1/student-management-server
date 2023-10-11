const constants = require("../utils/constants");
const { addData, updateData } = require("./firebaseRepository");

module.exports = class ScheduleRepository {
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
};
