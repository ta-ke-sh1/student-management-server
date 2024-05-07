const constants = require("../utils/constants");
const { addData, deleteData, updateData, fetchAllData, fetchDataById, db, snapshotToArray, fetchMatchingDataByField, setData } = require("./firebaseRepository");

module.exports = class AttendanceRepository {
    async fetchAttendance() {
        // const snapshot = await db.collection(constants.ATTENDANCES_TABLE).get();
        // return snapshotToArray(snapshot);

        return await fetchAllData(constants.ATTENDANCES_TABLE);
    }

    async fetchAttendanceByGroupId(groupId) {
        // const snapshot = await db.collection(constants.ATTENDANCES_TABLE).where("group_id", "==", groupId).get();
        // return snapshotToArray(snapshot);

        return await fetchMatchingDataByField(constants.ATTENDANCES_TABLE, "group_id", groupId);
    }

    async fetchAttendanceByGroupIdAndStudentId(groupId, studentId) {
        const snapshot = await db
            .collection(constants.ATTENDANCES_TABLE)
            .where("group_id", "==", groupId)
            .where("student_id", "==", studentId)
            .get();

        return snapshotToArray(snapshot);
    }

    async fetchAttendanceById(id) {
        // const snapshot = await db.collection(constants.ATTENDANCES_TABLE).doc(id).get()
        // return {
        //     id: snapshot.id,
        //     ...snapshot.data()
        // }

        return await fetchDataById(constants.ATTENDANCES_TABLE, id);
    }

    async addAttendance(document) {
        let id = document.group_id + "-" + document.student_id + "-session" + document.session;
        return await setData(constants.ATTENDANCES_TABLE, id, document);
    }

    async updateAttendance(id, document) {
        return await updateData(constants.ATTENDANCES_TABLE, id, document);
    }

    async deleteAttendance(id) {
        return await deleteData(constants.ATTENDANCES_TABLE, id);
    }
};
