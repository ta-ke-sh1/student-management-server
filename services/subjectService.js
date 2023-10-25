const { fetchDataById, addData, deleteData, setData, updateData, fetchAllData } = require("../repository/firebaseRepository");
const constants = require("../utils/constants");
const Utils = require("../utils/utils");

const utils = new Utils();

const SubjectService = class {
  async fetchAllClass() {
    const classes = await fetchAllData(constants.CLASS_TABLE);
    return classes;
  }

  async editSubject(id, data) {
    if (!id) throw "Invalid id!";
    if (utils.isNonEmptyObject(data)) throw "Subject data missing fields!";
    return await updateData(constants.SUBJECTS_TABLE, id, data);
  }

  async addSubject(data) {
    if (utils.isNonEmptyObject(data)) throw "Subject data missing fields!";
    return await addData(constants.SUBJECTS_TABLE, data);
  }

  async deleteSubject(id) {
    if (!id) throw "Invalid id!";
    return await deleteData(constants.SUBJECTS_TABLE, id);
  }
};

module.exports = SubjectService;
