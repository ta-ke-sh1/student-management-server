const {
    fetchDataById,
    addData,
    deleteData,
    setData,
    updateData,
    fetchAllData,
} = require("../repository/firebaseRepository");
const constants = require("../utils/constants");
const Utils = require("../utils/utils");

const utils = new Utils();

const FeedbackService = class {
    async fetchAllFeedback() {
        const feedbackes = await fetchAllData(constants.FEEDBACK_TABLE);
        return feedbackes;
    }

    async editFeedback(feedback_id, data) {
        const res = await updateData(
            constants.FEEDBACK_TABLE,
            feedback_id,
            ...data
        );
        return res;
    }

    async deleteFeedback(Feedback_id) {
        const res = await deleteData(constants.FEEDBACK_TABLE, Feedback_id);
        return res;
    }

    async addFeedback(data) {
        let feedback = {
            address: data.address,
            city: data.city,
            country: data.country,
            name: data.name,
        };
        if (utils.isNonEmptyObject(feedback)) return -1;
        const res = await addData(constants.FEEDBACK_TABLE, feedback);
        return res;
    }

    async fetchFeedbackById(Feedback_id) {
        if (!Feedback_id) {
            throw "Invalid Feedback id!";
        }
        let feedback = await fetchDataById(
            constants.FEEDBACK_TABLE,
            Feedback_id
        );
        if (feedback === -1) {
            throw "Feedback does not exist";
        }
        return feedback;
    }
};

module.exports = FeedbackService;
