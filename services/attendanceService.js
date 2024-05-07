const AttendanceRepository = require("../repository/attendanceRepository");

const AttendanceService = class {

    attendanceRepository;

    constructor() {
        this.attendanceRepository = new AttendanceRepository();
    }

    async fetchAllAttendance() {
        const campuses = await this.attendanceRepository.fetchAttendance();
        return campuses;
    }

    async editAttendance(id, data) {
        const res = await this.attendanceRepository.updateAttendance(id, data);
        return res;
    }

    async deleteAttendance(id) {
        const res = await this.attendanceRepository.deleteAttendance(id);
        return res;
    }

    async addAttendance(data) {
        const res = await this.attendanceRepository.addAttendance(data)
        return res;
    }

    async fetchAttendanceById(id) {
        if (!id) {
            throw "Invalid Attendance id!";
        }
        let attendance = await this.attendanceRepository.fetchAttendanceById(id)
        if (attendance === -1) {
            throw "Attendance does not exist";
        }
        return attendance;
    }
};

module.exports = AttendanceService;
