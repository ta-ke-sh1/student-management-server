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

const SubjectService = class {
    async fetchAllClass() {
        const classes = await fetchAllData(constants.CLASS_TABLE);
        return classes;
    }

    async editSubject(id, data) {
        try {
            if (utils.isNonEmptyObject(data)) return -1;
            const res = await updateData(constants.SUBJECTS_TABLE, id, data);
            return {
                status: true,
                message: res
            }
        } catch (e) {
            return {
                status: false,
                message: e.toString()
            }
        }

    }

    async addSubject(data) {
        try {
            if (utils.isNonEmptyObject(data)) return -1;
            const res = await addData(constants.SUBJECTS_TABLE, data);
            return {
                status: true,
                message: res
            }
        } catch (e) {
            return {
                status: false,
                message: e.toString()
            }
        }

    }

    async deleteSubject(id) {
        try {
            const res = await deleteData(constants.SUBJECTS_TABLE, id);
            return res;
        } catch (e) {
            return {
                status: false,
                message: e.toString()
            }
        }
    }
};

module.exports = SubjectService;