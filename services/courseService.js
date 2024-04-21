const CourseRepostory = require("../repository/courseRepository");
const { db, snapshotToArray } = require("../repository/firebaseRepository");
const SubmissionRepository = require("../repository/submissionRepository");
const constants = require("../utils/constants");
const Utils = require("../utils/utils");
const ClassService = require("./classService");
const { UserService } = require("./userService");

const path = require("path");

module.exports = class CourseService {
    courseRepository;
    userService;
    utils;
    submissionRepository;

    constructor() {
        this.courseRepository = new CourseRepostory();
        this.userService = new UserService();
        this.classService = new ClassService();
        this.utils = new Utils();
        this.submissionRepository = new SubmissionRepository();
    }

    async fetchCourseByUserId(id, role) {
        let snapshots;
        let results = [];

        if (role === 1) {
            snapshots = await db
                .collection(constants.COURSES_REGISTRATION_TABLE)
                .where("student_id", "==", id)
                .get();

            let courses = snapshotToArray(snapshots);

            for (const i in courses) {
                let snapshot = await db
                    .collection(constants.CLASS_TABLE)
                    .doc(courses[i].group_id)
                    .get();
                const group = {
                    id: snapshot.id,
                    ...snapshot.data(),
                };
                const data = {
                    ...courses[i],
                    ...group,
                };
                results.push(data);
            }
        } else if (role === 2) {
            snapshots = await db
                .collection(constants.CLASS_TABLE)
                .where("lecturer", "==", id)
                .get();
            results = snapshotToArray(snapshots);
        } else {
            throw "Invalid role";
        }
        return results;
    }

    async fetchCourseById(id) {
        let course = await this.courseRepository.fetchCourseById(id);
        return course;
    }

    async fetchCourseByClassAndId(course_id, class_id) { }

    async fetchCourseByUserIdAndCourseId(semester, user_id, course_id) {
        let course = await this.courseRepository.fetchCourseByUserIdAndCourseId(
            semester,
            user_id,
            course_id
        );
        return course;
    }

    async submitAssignment(submission) {
        console.log(submission);
        let response = await this.courseRepository.addSubmission(submission);
        return response;
    }

    async deleteLocalResourceByQuery(query) {
        let file_path =
            "asset\\course\\resources\\" +
            query.programme +
            "\\" +
            query.semester +
            "\\" +
            query.course +
            "\\" +
            query.group +
            "\\" +
            query.file;
        var dir = path.resolve() + "\\" + file_path ?? "";
        return await this.utils.deleteFileByPath(dir);
    }

    async addCourse(course) {
        course.status = true;
        return this.courseRepository.addCourse(course);
    }

    async deleteCourse(id) {
        return this.courseRepository.deleteCourse(id);
    }

    async deleteHardCourse(id) {
        return this.courseRepository.deleteHardCourse(id);
    }

    async editCourse(id, course) {
        return this.courseRepository.editCourse(id, course);
    }

    async handleCourse(id, option) {
        return this.courseRepository.editCourse(id, option);
    }

    async fetchSubmissionByCourseIdAndUserAndAssignmentId(id, user, asm) {
        if (!id) {
            throw "Missing course id";
        }
        if (!user) {
            throw "Missing user id";
        }
        if (!asm) {
            throw "Missing assignment id!";
        }
        console.log(id, user, asm)
        return this.submissionRepository.fetchSubmissionByCourseIdAndUserAndAssignmentId(
            id,
            user,
            asm
        );
    }

    async deleteCourseAssignment(id, courseId) {
        return this.courseRepository.deleteCourseAssignment(id, courseId)
    }

    async addCourseAssignment(assignment) {
        return this.courseRepository.addCourseAssignment(assignment);
    }

    async editCourseAssignment(assignment) {
        return this.courseRepository.editCourseAssignment(assignment)
    }

    async fetchUserCourseById(id) {
        return this.courseRepository.fetchUserCourseById(id);
    }

    async fetchCourseworksByCourseId(id) {
        return this.courseRepository.fetchCourseworksByCourseId(id);
    }

    async fetchMaterialsByCourseId(id) {
        return this.courseRepository.fetchMaterialsByCourseId(id);
    }

    async fetchSubmissionById(id) {
        return await this.submissionRepository.fetchSubmissionById(id);
    }

    async fetchSubmissionsByAssignmentId(id) {
        return await this.submissionRepository.fetchSubmissionByAssignmentId(
            id
        );
    }

    async fetchSubmissionByCourseId(id) {
        return await this.submissionRepository.fetchSubmissionByCourseId(id);
    }

    async fetchAssignmentsByCourseIdAndAssignmentId(course_id, assignment_id) {
        return this.submissionRepository.fetchAssignmentsByCourseIdAndAssignmentId(
            course_id,
            assignment_id
        );
    }

    async fetchSchedulesByCourseId(id) {
        return this.courseRepository.fetchSchedulesByCourseId(id);
    }

    async fetchParticipantsByCourseId(id) {
        return this.courseRepository.fetchParticipantsByCourseId(id);
    }

    async fetchAttendancesByCourseId(id, session) {
        return this.courseRepository.fetchAttendancesByCourseId(id, session);
    }

    async fetchCourseByLecturerId(id) {
        return this.courseRepository.fetchCourseByLecturerId(id);
    }

    async fetchAllRegistrations() {
        return this.courseRepository.fetchAllRegistrations();
    }

    async summarizeGradesByCourseId(id) {
        console.log(id)
        const assignments = await this.courseRepository.fetchAssignmentsByCourse(id)
        const participants = await this.courseRepository.fetchParticipantsByCourseId(id)

        for (let i = 0; i < participants.length; i++) {
            console.log(participants[i])

            let grade = 0;

            for (let j = 0; j < assignments.length; j++) {
                const submission = await this.fetchSubmissionByCourseIdAndUserAndAssignmentId(id, participants[i].student_id, assignments[j].id)
                console.log(submission)
                if (submission) {
                    let value = submission.grade * assignments[j].percentage
                    grade += value
                }
            }

            let gradeText = this.getGradeTextFromNumber(grade)
            let gradeTicket = {
                grade: grade,
                gradeText: gradeText
            }

            console.log(gradeTicket)
            await this.courseRepository.updateCourseRegistration(participants[i].id, gradeTicket)
        }
    }

    getGradeTextFromNumber(grade) {
        if (grade < 4) {
            return "Refer"
        } else if (grade < 7) {
            return "Pass"
        } else if (grade < 10) {
            return "Merit"
        } else if (grade < 11) {
            return "Distinction"
        } else {
            return "Invalid"
        }
    }
};
