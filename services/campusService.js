const { fetchDataById, addData, deleteData, setData, updateData, fetchAllData } = require("../repository/firebaseRepository")
const constants = require("../utils/constants");

const CampusService = class {

    async validCampus() {

    }

    async reserveCampus() {

    }

    async getAllCampus() {
        const campuses = await fetchAllData(constants.CAMPUS_TABLE)
        return campuses;
    }

    async editCampus(Campus_id, Campus_obj) {
        const res = await updateData(constants.CAMPUS_TABLE, Campus_id, Campus_obj)
        return res;
    }

    async deleteCampus(Campus_id) {
        const res = await deleteData(constants.CAMPUS_TABLE, Campus_id)
        return res;
    }

    async addCampus(Campus_obj) {
        const res = await addData(constants.CAMPUS_TABLE, Campus_obj)
        return res;
    }

    async getCampusById(Campus_id) {
        if (!Campus_id) {
            return {
                error: "Invalid Campus id!"
            }
        }
        let campus = await fetchDataById(constants.CAMPUS_TABLE, Campus_id);
        if (campus === -1) {
            return {
                error: "Campus does not exist"
            }
        }
        return campus;
    }
}

module.exports = { CampusService }