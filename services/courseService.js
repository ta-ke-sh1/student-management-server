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

        // Find student course in Course Registration table
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
        } else if (role === 2) { // Find lecturer course in class table
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

    async deleteMaterialById(id, course) {
        return this.courseRepository.deleteMaterialById(id, course);
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
        // Get exisitng attendances ticket
        let existingAttendances = await this.courseRepository.fetchAttendancesByCourseId(id, session);

        // Get all the participants
        let participants = await this.fetchParticipantsByCourseId(id);

        for (let i = 0; i < participants.length; i++) {
            // Find existing attendance ticket
            let isExist = existingAttendances.find((attendance) => attendance.student_id === participants[i].student_id);

            // Create a new one if ticket is not found
            if (!isExist) {
                existingAttendances.push({
                    dob: participants[i].dob,
                    group_id: id,
                    status: true,
                    student_id: participants[i].student_id,
                    id: id + "-" + participants[i].student_id + "-session" + session,
                    remark: -1,
                    session: session
                })
            }
        }

        return existingAttendances;
    }

    // Fetch lecturer course 
    async fetchCourseByLecturerId(id) {
        return this.courseRepository.fetchCourseByLecturerId(id);
    }

    // Fetch student course registration
    async fetchAllRegistrations() {
        return this.courseRepository.fetchAllRegistrations();
    }

    // SUmmarize grade by course
    // Loop through all students within that course
    async summarizeGradesByCourseId(id) {
        // Fetch all assignments
        const assignments = await this.courseRepository.fetchAssignmentsByCourse(id)

        // Fetch all participants
        const participants = await this.courseRepository.fetchParticipantsByCourseId(id)

        // Get sum percentage 
        let totalPercentage = 0;
        for (let i = 0; i < assignments.length; i++) {
            totalPercentage += assignments[i].percentage;
        }
        totalPercentage *= 100;

        // Loop through the participants
        // then loop through the assignment to assess the grade
        // O(n^2) complexity
        for (let i = 0; i < participants.length; i++) {

            let grade = 0;

            for (let j = 0; j < assignments.length; j++) {
                // Find grade in database

                const submission = await this.fetchSubmissionByCourseIdAndUserAndAssignmentId(id, participants[i].student_id, assignments[j].id)
                console.log(submission)
                if (submission) {
                    let value = submission.grade * assignments[j].percentage
                    grade += value
                }
            }

            // Multiply by ratio in case total percentage is less than 100%
            grade = grade / totalPercentage * 100

            // Limit to 1 number behind decimal point
            grade = parseFloat(grade.toFixed(1))

            // Get grade text
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

    async addMaterial(material) {
        return await this.courseRepository.addMaterial(material);
    }
};
