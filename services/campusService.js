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

const CampusService = class {
    async getAllCampus() {
        const campuses = await fetchAllData(constants.CAMPUS_TABLE);
        return campuses;
    }

    async editCampus(campus_id, data) {
        const res = await updateData(
            constants.CAMPUS_TABLE,
            campus_id,
            ...data
        );
        return res;
    }

    async deleteCampus(Campus_id) {
        const res = await deleteData(constants.CAMPUS_TABLE, Campus_id);
        return res;
    }

    async addCampus(data) {
        let campus = {
            address: data.address,
            city: data.city,
            country: data.country,
            name: data.name,
        };
        if (utils.isNonEmptyObject(campus)) return -1;
        const res = await addData(constants.CAMPUS_TABLE, campus);
        return res;
    }

    async getCampusById(Campus_id) {
        if (!Campus_id) {
            return {
                error: "Invalid Campus id!",
            };
        }
        let campus = await fetchDataById(constants.CAMPUS_TABLE, Campus_id);
        if (campus === -1) {
            return {
                error: "Campus does not exist",
            };
        }
        return campus;
    }
};

module.exports = CampusService;
