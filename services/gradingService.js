const { fetchDataById, addData, deleteData, updateData, fetchMatchingDataByField } = require("../repository/firebaseRepository");
const GradeRepository = require("../repository/gradeRepository");
const constants = require("../utils/constants");

const GradingService = class {
  gradeRepository;

  constructor() {
    this.gradeRepository = new GradeRepository();
  }

  async validGrading() {}

  async reserveGrading() {}

  async fetchAllGradesByStudentId(query) {
    if (!query.id) throw "Missing parameter!";
    return await this.gradeRepository.fetchAllGradesByStudentId(query.id);
  }

  async fetchAllGradesByStudentIdAndSemester(query) {
    if (!query.id || !query.semester) throw "Missing parameter!";
    return await this.gradeRepository.fetchAllGradesByStudentId(query.id);
  }

  async fetchAllGradesByStudentIdAndTermAndProgrammeAndDepartmentAndGroup(query) {
    if (!query.id || !query.term || !query.programme || !query.department || !query.group) throw "Missing parameter!";
    return await this.gradeRepository.fetchAllGradesByStudentIdAndTermAndProgrammeAndDepartmentAndGroup(query.id, query.term, query.programme, query.department, query.group);
  }

  async editGrading(Grading_id, Grading_obj) {
    const res = await updateData(constants.SUBMISSIONS_TABLE, Grading_id, Grading_obj);
    return res;
  }

  async deleteGrading(Grading_id) {
    const res = await deleteData(constants.SUBMISSIONS_TABLE, Grading_id);
    return res;
  }

  async addGrading(Grading_obj) {
    const res = await addData(constants.SUBMISSIONS_TABLE, Grading_obj);
    return res;
  }

  async fetchGradingById(Grading_id) {
    if (!Grading_id) {
      throw "Invalid Grading id!";
    }
    let grading = await fetchDataById(constants.SUBMISSIONS_TABLE, Grading_id);
    if (grading === -1) {
      throw "Grading does not exist";
    }
    return grading;
  }
};

module.exports = { GradingService };
