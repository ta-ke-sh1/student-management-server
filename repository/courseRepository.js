const constants = require("../utils/constants");
const {
    addData,
    deleteData,
    updateData,
    db,
    snapshotToArray,
    fetchAllData,
} = require("./firebaseRepository");

module.exports = class CourseRepostory {
    constructor() {}

    async updateGroup(id, data) {
        return await db.collection(constants.CLASS_TABLE).doc(id).update(data);
    }

    async fetchAllGroups() {
        let data = await db
            .collection(constants.CLASS_TABLE)
            .where("status", "==", true)
            .get();

        if (data.empty) {
            throw "Empty table, please add some data!";
        }

        return snapshotToArray(data);
    }

    async fetchParticipantsByIdAndTermAndProgrammeAndDepartment(group) {
        let data = await db
            .collection(constants.PARTICIPANTS_TABLE)
            .where("group", "==", group)
            .where("status", "==", true)
            .get();

        if (data.empty) {
            throw "No matching documents.";
        }

        return snapshotToArray(data);
    }

    async fetchGroupsByProgrammeAndTermAndDepartment(
        programme,
        term,
        department
    ) {
        let data = await db
            .collection(constants.CLASS_TABLE)
            .where("programme", "==", programme)
            .where("term", "==", term)
            .where("department", "==", department)
            .where("status", "==", true)
            .get();

        let results = await snapshotToArray(data);
        results.forEach((result) => {
            result.programme = programme;
            result.term = term;
            result.department = department;
        });

        return results;
    }

    async addGroup(data) {
        console.log(data.id);
        let ref = db.collection(constants.CLASS_TABLE).doc(data.id);
        let g = await ref.get();
        if (g.exists) {
            throw "Group already exists!";
        } else {
            delete data.slot;
            delete data.id;
            await ref.set(data);
            return true;
        }
    }

    async addSubmission(submision) {
        let result = await db
            .collection(constants.SUBMISSIONS_TABLE)
            .add(submision);
        return result;
    }

    async fetchCourseById(id) {
        let snapshot = await db.collection(constants.CLASS_TABLE).doc(id).get();

        let assignments = await db
            .collection(constants.CLASS_TABLE)
            .doc(id)
            .collection(constants.COURSEWORK_DETAILS_TABLE)
            .get();

        if (!snapshot.exists) {
            throw "Course does not exist!";
        }

        let group = {
            id: snapshot.id,
            ...snapshot.data(),
            assignments: snapshotToArray(assignments),
        };

        let subject = await db
            .collection(constants.SUBJECTS_TABLE)
            .doc(group.subject)
            .get();
        if (!subject.exists) {
            throw "Invalid Subject code!";
        }

        let s = {
            id: subject.id,
            ...subject.data(),
        };

        group.title = s.name;
        group.description = s.description;

        return group;
    }

    async fetchAssignmentsByCourse(id) {
        const snapshots = await db
            .collection(constants.SUBMISSIONS_TABLE)
            .where("group", "==", id)
            .get();

        return snapshotToArray(snapshots);
    }

    async fetchCourseByUserIdAndCourseId(semester, user_id, course_id) {
        return {
            test: "Mocking",
        };
    }

    async submitCourseworkSubmission(coursework) {
        return await db.collection(constants.SUBMISSIONS_TABLE).add(coursework);
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

    async deleteCourse(id) {
        return await updateData(constants.COURSES_TABLE, id, { status: false });
    }

    async deleteHardCourse(id) {
        return await deleteData(constants.COURSES_TABLE, id);
    }

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

    async addCourseAssignment(assignment) {
        console.log(assignment);
        let doc = await db
            .collection(constants.CLASS_TABLE)
            .doc(assignment.id)
            .collection(constants.COURSEWORK_DETAILS_TABLE)
            .where("name", "==", assignment.name)
            .get();

        if (doc.length > 0) {
            throw "Already exists assignment with this name!";
        } else {
            assignment.status = true;
            return await db
                .collection(constants.CLASS_TABLE)
                .doc(assignment.id)
                .collection(constants.COURSEWORK_DETAILS_TABLE)
                .add(assignment);
        }
    }

    async fetchUserCourseById(id) {
        let snapshots = await db
            .collection(constants.COURSES_REGISTRATION_TABLE)
            .where("student_id", "==", id)
            .get();

        return snapshotToArray(snapshots);
    }

    async fetchCourseworksByCourseId(id) {
        let snapshots = await db
            .collection(constants.CLASS_TABLE)
            .doc(id)
            .collection(constants.COURSEWORK_DETAILS_TABLE)
            .get();

        return snapshotToArray(snapshots);
    }

    async fetchMaterialsByCourseId(id) {
        let snapshots = await db
            .collection(constants.CLASS_TABLE)
            .doc(id)
            .collection(constants.MATERIALS_TABLE)
            .get();

        return snapshotToArray(snapshots);
    }

    async fetchSchedulesByCourseId(id) {
        let snapshots = await db
            .collection(constants.SCHEDULE_SLOTS_TABLE)
            .where("course_id", "==", id)
            .get();
        return snapshotToArray(snapshots);
    }

    async fetchParticipantsByCourseId(id) {
        let snapshots = await db
            .collection(constants.COURSES_REGISTRATION_TABLE)
            .where("group_id", "==", id)
            .get();
        return snapshotToArray(snapshots);
    }

    async fetchAttendancesByCourseId(id, session) {
        let snapshots = await db
            .collection(constants.ATTENDANCES_TABLE)
            .where("group_id", "==", id)
            .where("session", "==", session)
            .get();
        return snapshotToArray(snapshots);
    }

    async fetchCourseByLecturerId(id) {
        let snapshots = await db
            .collection(constants.CLASS_TABLE)
            .where("lecturer", "==", id)
            .get();
        return snapshotToArray(snapshots);
    }

    async fetchAllRegistrations() {
        return await fetchAllData(constants.COURSES_REGISTRATION_TABLE);
    }
};
