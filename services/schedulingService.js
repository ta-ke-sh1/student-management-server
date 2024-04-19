const CourseRepostory = require("../repository/courseRepository");
const {
    fetchDataById,
    deleteData,
    updateData,
    fetchMatchingDataByField,
    db,
} = require("../repository/firebaseRepository");
const ScheduleRepository = require("../repository/scheduleRepository");
const constants = require("../utils/constants");
const moment = require("moment");

const ScheduleService = class {
    constructor() {
        this.courseRepository = new CourseRepostory();
        this.scheduleRepository = new ScheduleRepository();
    }

    async fetchScheduleByGroupId(id) {
        if (!id) {
            throw "Missing id";
        } else {
            console.log("Service:");
            console.log(id);
            let res = await fetchMatchingDataByField(
                constants.SCHEDULE_SLOTS_TABLE,
                "course_id",
                id
            );
            return res;
        }
    }

    async fetchScheduleByStudentIdAndDate(query) {
        if (
            query.user_id &&
            query.startDate &&
            query.endDate &&
            query.course_id
        ) {
            let courses = query.course_id.split("%");

            let results = [];
            for (let index = 0; index < courses.length; index++) {
                console.log(courses[index]);
                if (courses[index] != "") {
                    const data =
                        await this.scheduleRepository.fetchScheduleByStudentIdAndCourseIdAndDate(
                            query.user_id,
                            courses[index],
                            query.startDate,
                            query.endDate
                        );

                    for (let j = 0; j < data.length; j++) {
                        results.push(data[j]);
                    }
                }
            }

            console.log(results);
            return results;
        } else {
            throw "Missing parameters";
        }
    }

    async fetchScheduleByLecturerIdAndDate(query) {
        console.log(query);
        if (query.user_id && query.startDate && query.endDate) {
            let res =
                await this.scheduleRepository.fetchScheduleByLecturerIdAndDate(
                    query.user_id,
                    query.startDate,
                    query.endDate
                );
            console.log(res);
            return res;
        } else {
            throw "Missing parameters";
        }
    }

    async fetchParticipantsByGroupId(id) {
        if (id) {
            let result =
                await this.scheduleRepository.fetchParticipantsByGroupId(id);
            if (result.length < 1) {
                throw "This group has no participants";
            } else {
                return result;
            }
        } else {
            throw "Missing group id";
        }
    }

    async checkAttendance(attendance_report) {
        return await this.scheduleRepository.checkAttendance(attendance_report);
    }

    async validSchedule(date, room, user_id) {
        let slot = this.scheduleRepository.fetchScheduleByDateAndRoom(
            date,
            room,
            user_id
        );
        return slot.length === 0;
    }

    async fetchAllSchedules(campus) {
        const schedules = await fetchMatchingDataByField(
            constants.SCHEDULE_SLOTS_TABLE,
            "campus",
            campus
        );
        return schedules;
    }

    async editSchedule(data) {
        const dateString = moment(data.date).format("YYYY-MM-DD")
        this.checkScheduleAvailability(data, dateString)

        const res = await updateData(
            constants.SCHEDULE_SLOTS_TABLE,
            data.id,
            data
        );
        return res;
    }

    async deleteSchedule(Schedule_id) {
        const res = await deleteData(
            constants.SCHEDULE_SLOTS_TABLE,
            Schedule_id
        );
        return res;
    }

    async checkScheduleAvailability(data, dateString) {
        // check availablity by room + slot + date
        const roomAvailable = await this.scheduleRepository.fetchScheduleBySlotAndDateAndRoom(dateString, data.slot, data.room)
        if (roomAvailable.length > 0) {
            throw "Room is booked by course " + roomAvailable[0].course_id
        }
        console.log(roomAvailable)

        // check availability by lecturer + slot + date
        const lecturerAvailable = await this.scheduleRepository.fetchScheduleBySlotAndDateAndRoom(dateString, data.slot, data.lecturer)
        if (lecturerAvailable.length > 0) {
            throw "Lecturer will be teaching course " + lecturerAvailable[0].course_id
        }
    }

    async addSchedule(data) {
        const dateString = moment(data.date).format("YYYY-MM-DD")
        this.checkScheduleAvailability(data, dateString)

        data.dateString = dateString;
        const res = await this.scheduleRepository.setSchedule(data.course_id + "-" + slot, data)
        return res;
    }

    async fetchScheduleById(Schedule_id) {
        if (!Schedule_id) {
            throw "Invalid Schedule id!";
        }
        let schedule = await fetchDataById(
            constants.SCHEDULE_SLOTS_TABLE,
            Schedule_id
        );
        if (schedule === -1) {
            throw "Schedule does not exist";
        }
        return schedule;
    }

    async addParticipantToGroup(data) {
        const group = data.group;
        const participants = data.participants;

        const schedules = await this.fetchScheduleByGroupId(group.id);

        for (const j in participants) {
            await db
                .collection(constants.COURSES_REGISTRATION_TABLE)
                .doc(group.id + "-" + participants[j].id)
                .set({
                    status: true,
                    group_id: group.id,
                    student_id: participants[j].id,
                    dob: participants[j].dob,
                    firstName: participants[j].firstName,
                    lastName: participants[j].lastName,
                });

            var batch = db.batch();

            for (let i = 0; i < schedules.length; i++) {
                let obj = {
                    group_id: group.id,
                    dob: participants[j].dob,
                    student_id: participants[j].id,
                    session: schedules[i].session,
                    date: schedules[i].date,
                    status: true,
                    remark: -1,
                };
                console.log(schedules[i].date);
                let ref = db
                    .collection(constants.ATTENDANCES_TABLE)
                    .doc(
                        group.id +
                        "-" +
                        participants[j].id +
                        "-session" +
                        schedules[i].session
                    );
                batch.set(ref, obj);
            }

            batch
                .commit()
                .then(function () {
                    console.log("Batch committed successfully");
                })
                .catch(function (error) {
                    console.error("Error committing batch:", error);
                });
        }
    }

    async milisecondsToString(milliseconds) {
        let date = new Date(milliseconds);
        let year = date.getFullYear();
        let month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero based
        let day = ("0" + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

    async fetchAllGroups() {
        return await this.courseRepository.fetchAllGroups();
    }

    async fetchGroupsByProgrammeAndTerm(programme, term, department) {
        let groups =
            await this.scheduleRepository.fetchGroupsByProgrammeAndTermAndDepartment(
                programme,
                term,
                department
            );
        groups.forEach((group) => {
            (group.programme = programme),
                (group.term = term),
                (group.department = department);
        });
        return groups;
    }

    async addGroupAndCreateSchedules(data) {
        if (!data.programme || !data.term || !data.department || !data.name) {
            throw "Missing parameter";
        }

        let d_id =
            data.programme +
            "-" +
            data.term +
            "-" +
            data.department +
            "-" +
            data.name;
        data.id = d_id;
        console.log(data);
        let slot = data.slot;

        await this.courseRepository.addGroup(data);

        if (data.slots > 0) {
            let schedules =
                await this.createSchedulesUsingDayAndSlotAndStartAndEndDate(
                    slot,
                    data.startDate,
                    data.endDate,
                    data.slots
                );
            schedules.forEach(async (schedule, index) => {
                let obj = {
                    session: index,
                    dateString: schedule.dateString,
                    date: schedule.date,
                    slot: schedule.slot,
                    room: "N/A",
                    lecturer: data.lecturer,
                    course_id: d_id,
                    subject: data.subject,
                    status: true,
                };
                await this.scheduleRepository.setSchedule(
                    d_id + "-" + index,
                    obj
                );
            });
        }
        return true;
    }

    async fetchAttendances() {
        return this.scheduleRepository.fetchAttendances();
    }

    async fetchSchedules() {
        return this.scheduleRepository.fetchSchedules();
    }

    async createSchedulesUsingDayAndSlotAndStartAndEndDate(
        slot,
        startDate,
        endDate,
        maxSlots
    ) {
        let schedules = [];
        let start = new Date(startDate);
        let end = new Date(endDate);
        let schedule = new Date(start.getTime());
        while (schedule <= end) {
            for (let s of slot) {
                if (s.number === schedule.getDay()) {
                    if (schedules.length >= maxSlots) {
                        return schedules;
                    } else {
                        let d = moment(schedule).format("YYYY-MM-DD");
                        schedules.push({
                            dateString: d,
                            date: schedule.getTime(),
                            slot: s.slot,
                        });
                    }
                }
            }
            schedule.setDate(schedule.getDate() + 1);
        }
        return schedules;
    }

    async fetchAllAttendancesByScheduleId(id) {
        return this.scheduleRepository.fetchAllAttendancesByScheduleId(id);
    }

    async updateGroup(id, data) {
        delete data.slot;
        delete data.dayOfTheWeek;
        return this.courseRepository.updateGroup(id, data);
    }

    async deleteSchedules(query) {
        await this.scheduleRepository.deleteSchedules(query);
    }

    async deleteParticipantFromGroup(groupId, studentId) {
        return this.scheduleRepository.deleteParticipantFromGroup(
            groupId,
            studentId
        );
    }
};

module.exports = { ScheduleService };
