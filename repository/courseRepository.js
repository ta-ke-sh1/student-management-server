const constants = require("../utils/constants");
const { addData, deleteData, updateData, db, snapshotToArray } = require("./firebaseRepository");

module.exports = class CourseRepostory {
  constructor() { }

  async fetchAllGroups() {
    let data = await db.collection(constants.CLASS_TABLE).where("status", "==", true).get();

    if (data.empty) {
      throw ("Empty table, please add some data!");
    }

    return snapshotToArray(data);
  }

  async fetchParticipantsByIdAndTermAndProgrammeAndDepartment(group) {
    let data = await db.collection(constants.PARTICIPANTS_TABLE).where("group", "==", group).where("status", "==", true).get();

    if (data.empty) {
      throw ("No matching documents.");
    }

    return snapshotToArray(data);
  }

  async fetchGroupsByProgrammeAndTermAndDepartment(programme, term, department) {
    let data = await db.collection(constants.CLASS_TABLE).where("programme", "==", programme).where("term", "==", term).where("department", "==", department).where("status", "==", true).get();

    let results = await snapshotToArray(data);
    results.forEach((result) => {
      result.programme = programme;
      result.term = term;
      result.department = department;
    });

    return results;
  }

  async addGroupBySemester(data) {
    console.log(data);
    let ref = db.collection(constants.CLASS_TABLE).where("programme", "==", programme).where("term", "==", term).where("department", "==", department).doc();

    let g = await ref.get();
    if (g.exists) {
      throw "Group already exists!";
    } else {
      console.log("Add group");

      let res = await ref.set({
        lecturer: data.lecturer ?? "NA",
        subject: data.subject ?? "NA",
        slots: data.slots ?? 0,
      });

      return {
        status: true,
        msg: res,
      };
    }
  }

  async addSubmission(submision) {
    let result = await db.collection(constants.SUBMISSIONS_TABLE).add(submision);
    return result;
  }

  async fetchCourseByProgrammeAndTermAndDepartmentAndId(id) {
    let snapshot = await db.collection(constants.COURSES_REGISTRATION_TABLE).doc(id).get();
    if (snapshot.exists) {
      return {
        id: snapshot.id,
        ...snapshot.data(),
      };
    } else {
      throw "Course does not exist!";
    }
  }

  async fetchAssignmentsByCourse(id) {
    const snapshots = await db.collection(constants.SUBMISSIONS_TABLE).where("group", "==", id).get();

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
    let doc = await db.collection(constants.SUBMISSIONS_TABLE).doc(assignment.id).get();
    if (doc.exists) {
      throw "Already exists assignment with this name!";
    } else {
      let asm = assignment;
      let name = asm.name;

      delete asm.name;
      delete asm.id;

      return await db
        .collection(constants.COURSES_REGISTRATION_TABLE)
        .doc(assignment.id)
        .collection(constants.SUBMISSIONS_TABLE)
        .doc(name)
        .set({
          ...assignment,
          status: true,
        });
    }
  }
};
