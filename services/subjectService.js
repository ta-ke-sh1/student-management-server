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
    return await updateData(constants.SUBJECTS_TABLE, id, data);
  }

  async addSubject(data) {
    let subject = await fetchDataById(constants.SUBJECTS_TABLE, data.id);
    console.log(subject)
    if (subject !== -1) {
      throw "Already exists subject with this code!"
    }
    // return await setData(constants.SUBJECTS_TABLE, data.id, data);
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
