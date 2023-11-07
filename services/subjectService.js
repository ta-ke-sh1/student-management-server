const { fetchDataById, addData, deleteData, setData, updateData, fetchAllData, fetchMatchingDataByField } = require("../repository/firebaseRepository");
const constants = require("../utils/constants");
const Utils = require("../utils/utils");


const SubjectService = class {

  async fetchAllSubjectsByDepartment(department) {
    return await fetchMatchingDataByField(constants.SUBJECTS_TABLE, "department", department)
  }

  async fetchAllSubjects() {
    const data = await fetchAllData(constants.SUBJECTS_TABLE);
    return data;
  }

  async editSubject(id, data) {
    if (!id) throw "Invalid id!";
    return await updateData(constants.SUBJECTS_TABLE, id.toString(), data);
  }

  async addSubject(data) {
    data.status = true;
    let subject = await fetchDataById(constants.SUBJECTS_TABLE, data.subjectId);
    if (subject !== -1 && subject.department === data.department) {
      throw "Already exists subject with this code in " + data.department + " department!"
    }
    let id = String(data.subjectId)
    delete data.subjectId
    return await setData(constants.SUBJECTS_TABLE, id, data);
  }

  async deleteSubject(id) {
    if (!id) throw "Invalid id!";
    let query = id.split("%")
    query.forEach(async (id) => {
      if (id && id !== "") {
        await deleteData(constants.SUBJECTS_TABLE, id);
      }
    })
    return true;
  }
};

module.exports = SubjectService;
