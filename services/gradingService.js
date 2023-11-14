const {
    fetchDataById,
    addData,
    deleteData,
    updateData,
    fetchMatchingDataByField,
    setData,
} = require("../repository/firebaseRepository");
const GradeRepository = require("../repository/gradeRepository");
const constants = require("../utils/constants");
const path = require("path");
const FileService = require("./fileService");

const GradingService = class {
    gradeRepository;
    fileService;

    constructor() {
        this.gradeRepository = new GradeRepository();
        this.fileService = new FileService();
    }

    async validGrading() { }

    async reserveGrading() { }

    async fetchAllGrades() {
        return await this.gradeRepository.fetchAllGrades();
    }

    async fetchAllGradesByStudentId(id) {
        return await this.gradeRepository.fetchAllGradesByStudentId(id);
    }

    async fetchAllGradesByStudentIdAndSemester(query) {
        if (!query.id || !query.semester) throw "Missing parameter!";
        return await this.gradeRepository.fetchAllGradesByStudentId(query.id);
    }

    async fetchAllGradesByStudentIdAndTermAndProgrammeAndDepartmentAndGroup(
        query
    ) {
        if (
            !query.id ||
            !query.term ||
            !query.programme ||
            !query.department ||
            !query.group
        )
            throw "Missing parameter!";
        return await this.gradeRepository.fetchAllGradesByStudentIdAndTermAndProgrammeAndDepartmentAndGroup(
            query.id,
            query.term,
            query.programme,
            query.department,
            query.group
        );
    }

    async editGrading(grading_id, grading_obj) {
        const res = await updateData(
            constants.SUBMISSIONS_TABLE,
            grading_id,
            grading_obj
        );
        return res;
    }

    async deleteGrading(grading_id) {
        const res = await updateData(constants.SUBMISSIONS_TABLE, grading_id, {
            status: false,
        });
        return res;
    }

    async deleteGradingHard(grading_id) {
        const res = await deleteData(constants.SUBMISSIONS_TABLE, grading_id);
        return res;
    }

    async addGrading(grading_obj, files) {
        const p =
            "\\submissions\\" +
            grading_obj.programme +
            "\\" +
            grading_obj.course_id +
            "\\" +
            grading_obj.assignment_id +
            "\\" +
            grading_obj.user_id +
            "\\";
        const folder = path.resolve() + "\\asset" + p;
        this.fileService.removeFileByPath(folder);

        this.fileService.addMultipleFilesByPath(files, folder);

        let fileNames = [];
        files.forEach((file) => {
            fileNames.push(file.originalname);
        });

        delete grading_obj.files;
        grading_obj.path = p;
        grading_obj.grade = 0;
        grading_obj.date = new Date().getTime();
        grading_obj.fileNames = fileNames;

        const id =
            grading_obj.course_id +
            "-" +
            grading_obj.assignment_id +
            "-" +
            grading_obj.user_id;
        return await setData(constants.SUBMISSIONS_TABLE, id, grading_obj);
    }

    async fetchGradingById(Grading_id) {
        if (!Grading_id) {
            throw "Invalid Grading id!";
        }
        let grading = await fetchDataById(
            constants.SUBMISSIONS_TABLE,
            Grading_id
        );
        if (grading === -1) {
            throw "Grading does not exist";
        }
        return grading;
    }

    async submitGrade(grade) {
        await this.gradeRepository.submitGrade(grade)
    }
};

module.exports = { GradingService };
