const constants = require("../utils/constants");
const {
    db,
    addData,
    deleteData,
    updateData,
    fetchAllData,
    fetchDataById,
    snapshotToArray,
} = require("./firebaseRepository");

module.exports = class FeedbackRepository {
    async fetchFeedbacks() {
        return await fetchAllData(constants.FEEDBACK_TABLE);
    }

    async fetchFeedbackById(id) {
        return await fetchDataById(constants.FEEDBACK_TABLE, id);
    }

    async addFeedback(document) {
        return await addData(constants.FEEDBACK_TABLE, document);
    }

    async updateFeedback(id, document) {
        return await updateData(constants.FEEDBACK_TABLE, id, document);
    }

    async deleteFeedback(id) {
        return await updateData(constants.FEEDBACK_TABLE, id, {
            status: false,
        });
    }

    async deleteHardFeedback(id) {
        return await deleteData(constants.FEEDBACK_TABLE, id);
    }

    async fetchFeedbackByCourse(course_id) {
        const data = await db
            .collection(constants.FEEDBACK_TABLE)
            .where("course_id", "==", course_id)
            .get();
        return snapshotToArray(data);
    }
};
