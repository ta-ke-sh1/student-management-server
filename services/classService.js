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

const ClassService = class {
    async fetchAllClass() {
        const classes = await fetchAllData(constants.CLASS_TABLE);
        return classes;
    }

    async editClass(class_id, data) {
        const res = await updateData(constants.CLASS_TABLE, class_id, ...data);
        return res;
    }

    async deleteClass(class_id) {
        const res = await deleteData(constants.CLASS_TABLE, class_id);
        return res;
    }

    async addClass(data) {
        if (utils.isNonEmptyObject(campus)) return -1;
        const res = await addData(constants.CLASS_TABLE, {});
        return res;
    }

    async fetchClassById(class_id) {
        if (!class_id) {
            return {
                error: "Invalid Class id!",
            };
        }
        let cls = await fetchDataById(constants.CLASS_TABLE, class_id);
        if (cls === -1) {
            return {
                error: "Class does not exist",
            };
        }
        return cls;
    }
};

module.exports = ClassService;
