const {
    fetchDataById,
    addData,
    deleteData,
    updateData,
    fetchMatchingDataByField,
} = require("../repository/firebaseRepository");
const constants = require("../utils/constants");

const GradingService = class {
    async validGrading() {}

    async reserveGrading() {}

    async fetchAllGradingsByStudentIdAndClassId() {
        const gradings = await fetchMatchingDataByField(
            constants.SUBMISSIONS_TABLE,
            "campus",
            campus
        );
        return gradings;
    }

    async fetchAllGradingsByClassId() {
        const gradings = await fetchMatchingDataByField(
            constants.SUBMISSIONS_TABLE,
            "campus",
            campus
        );
        return gradings;
    }

    async fetchAllGradingsByCourseId() {
        const gradings = await fetchMatchingDataByField(
            constants.SUBMISSIONS_TABLE,
            "campus",
            campus
        );
        return gradings;
    }

    async editGrading(Grading_id, Grading_obj) {
        const res = await updateData(
            constants.SUBMISSIONS_TABLE,
            Grading_id,
            Grading_obj
        );
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
            return {
                error: "Invalid Grading id!",
            };
        }
        let grading = await fetchDataById(
            constants.SUBMISSIONS_TABLE,
            Grading_id
        );
        if (grading === -1) {
            return {
                error: "Grading does not exist",
            };
        }
        return grading;
    }
};

module.exports = { GradingService };
