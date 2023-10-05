const constants = require("../utils/constants");
const { addData, updateData } = require("./firebaseRepository");

module.exports = class ScheduleRepository {
  async addSchedule(data) {
    return await addData(constants.USERS_TABLE, data);
  }
};
