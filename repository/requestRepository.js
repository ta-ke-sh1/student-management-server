const constants = require("../utils/constants");
const {
    addData,
    deleteData,
    updateData,
    fetchAllData,
} = require("./firebaseRepository");

module.exports = class RequestRepostory {
    async fetchRequest() {
        return await fetchAllData(constants.REQUEST_TABLE);
    }

    async submitRequestSubmission(coursework) {
        return await addData(constants.SUBMISSIONS_TABLE, coursework);
    }

    async updateRequestSubmission(coursework) {
        return await updateData(constants.COURSES_TABLE, coursework.id, {});
    }

    async addRequest(course) {
        return await addData(constants.COURSES_TABLE, course);
    }

    async editRequest(course) {
        return await updateData(constants.COURSES_TABLE, course.id, {});
    }

    async uploadSubmission(course, submissionFile) {}
};
