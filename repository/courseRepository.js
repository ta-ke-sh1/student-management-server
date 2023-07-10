const constants = require("../utils/constants");
const { addData, deleteData, updateData } = require("./firebaseRepository");

module.exports = class CourseRepostory {
    async submitCourseworkSubmission(coursework) {
        return await addData(constants.SUBMISSIONS_TABLE, coursework);
    }

    async updateCourseworkSubmission(coursework) {
        return await updateData(constants.COURSES_TABLE, coursework.id, {});
    }

    async addCourse(course) {
        return await addData(constants.COURSES_TABLE, course);
    }

    async editCourse(course) {
        return await updateData(constants.COURSES_TABLE, course.id, {});
    }
};
