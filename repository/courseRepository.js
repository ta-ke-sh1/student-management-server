const constants = require("../utils/constants");
const {
    addData,
    deleteData,
    updateData,
    fetchMatchingDataByField,
    fetchAllData,
    db,
    snapshotToArray,
    fetchDataById,
} = require("./firebaseRepository");

module.exports = class CourseRepostory {
    constructor() { }

    async fetchGroupsByProgrammeAndTerm(programme, term) {
        let data = await db.collection(constants.PROGRAMME_TABLE)
            .doc(programme)
            .collection(constants.TERMS_TABLE)
            .doc(term)
            .collection(constants.CLASS_TABLE)
            .get();

        return snapshotToArray(data);
    }

    async fetchCourseRegistrationByStudentIdAndSemester(semester, studentId) {
        let res = [];

        let studentCourses = await db
            .collection(constants.COURSES_REGISTRATION_TABLE)
            .where("semester", "==", semester)
            .where("studentId", "==", studentId)
            .get();

        studentCourses.forEach(async (course) => {
            let teacher = await fetchDataById(
                constants.USERS_TABLE,
                course.teacherId
            );

            res.push({
                id: course.id,
                className: course.classId,
                courseId: course.id,
                courseName: course.name,
                teacher: teacher.lastName + " " + teacher.firstName,
                campusId: "HaNoi",
                semester: semester,
                studentId: studentId,
            });
        });

        return [
            {
                id: "HdYSObbNePFj5uF7MtNj",
                className: "TCH2101",
                courseId: "1680",
                courseName: "Design Pattern",
                teacher: teacher.lastName + " " + teacher.firstName,
                campusId: "HaNoi",
                semester: "Fall_2022",
                studentId: studentId,
            },
            {
                id: "1dYSObbNePFj5uF7MtNj",
                className: "TCH2101",
                courseId: "1686",
                courseName: "Advanced Computing",
                teacher: "Doan Tran Tung",
                campusId: "HaNoi",
                semester: "Fall_2022",
                studentId: studentId,
            },
            {
                id: "2dYSObbNePFj5uF7MtNj",
                className: "TCH2101",
                courseId: "1520",
                courseName: "Cloud Computing",
                teacher: "Doan Tran Tung",
                campusId: "HaNoi",
                semester: "Summer_2022",
                studentId: studentId,
            },
            {
                id: "3dYSObbNePFj5uF7MtNj",
                className: "TCH2101",
                courseId: "1540",
                courseName: "Research Methodologies",
                teacher: "Doan Tran Tung",
                campusId: "HaNoi",
                semester: "Spring_2022",
                studentId: studentId,
            },
        ];
        // return await fetchMatchingDataByField(
        //     constants.COURSES_TABLE,
        //     "campusId",
        //     campusId
        // );
    }

    async fetchCourseByUserIdAndCourseId(semester, user_id, course_id) {
        // let data = await db
        //     .collection(constants.COURSES_REGISTRATION_TABLE)
        //     .where("semester", "==", semester)
        //     .where("user_id", "==", user_id)
        //     .where("course_id", "==", course_id)
        //     .get();

        // return snapshotToArray(data)[0];
        return {
            test: "Mocking",
        };
    }

    async submitCourseworkSubmission(coursework) {
        return await addData(constants.SUBMISSIONS_TABLE, coursework);
    }

    async updateCourseworkSubmission(coursework) {
        return await updateData(constants.COURSES_TABLE, coursework.id, {});
    }

    async addCourse(course) {
        return await addData(constants.COURSES_TABLE, course);
    }

    async editCourse(course) {
        return await updateData(constants.COURSES_TABLE, course.id, {});
    }

    async uploadSubmission(course, submissionFile) { }

    async fetchScheduleByDateAndRoom(date, room, user_id) {
        // let data = await db
        //     .collection(constants.SCHEDULE_SLOTS_TABLE)
        //     .where("date", "==", date)
        //     .where("room", "==", room)
        //     .where("user_id", "==", user_id)
        //     .get();
        // return snapshotToArray(data);
        return [];
    }
};
