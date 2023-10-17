const constants = require("../utils/constants");
const { addData, deleteData, updateData, fetchMatchingDataByField, fetchAllData, db, snapshotToArray, fetchDataById, setData } = require("./firebaseRepository");

module.exports = class CourseRepostory {
  constructor() {}
  async fetchParticipantsByIdAndTermAndProgrammeAndDepartment(id, term, programme, department) {
    let data = await db.collection(constants.PROGRAMME_TABLE).doc(programme).collection(constants.TERMS_TABLE).doc(term).collection(constants.DEPARTMENTS_TABLE).doc(department).collection(constants.CLASS_TABLE).doc(id).collection(constants.SCHEDULE_SLOTS_TABLE).get();

    if (data.empty) {
      console.log("No matching documents.");
      return [];
    }

    return snapshotToArray(data);
  }

  async fetchGroupsByProgrammeAndTermAndDepartment(programme, term, department) {
    let data = await db.collection(constants.PROGRAMME_TABLE).doc(programme).collection(constants.TERMS_TABLE).doc(term).collection(constants.DEPARTMENTS_TABLE).doc(department).collection(constants.CLASS_TABLE).where("status", "==", true).get();

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
    let ref = db.collection(constants.PROGRAMME_TABLE).doc(data.programme).collection(constants.TERMS_TABLE).doc(data.term).collection(constants.DEPARTMENTS_TABLE).doc(data.department).collection(constants.CLASS_TABLE).doc(data.name);

    let g = await ref.get();
    if (g.exists) {
      console.log({
        status: false,
        msg: "Group already exists!",
      });
      return {
        status: false,
        msg: "Group already exists!",
      };
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
    const snapshots = await db.collection(constants.COURSES_REGISTRATION_TABLE).doc(id).collection(constants.SUBMISSIONS_TABLE).get();
    return snapshotToArray(snapshots);
  }

  async fetchCourseByUserIdAndCourseId(semester, user_id, course_id) {
    return {
      test: "Mocking",
    };
  }

  async submitCourseworkSubmission(coursework) {
    return await db.collection(constants.COURSES_REGISTRATION_TABLE).doc(assignment.id).collection(constants.SUBMISSIONS_TABLE).doc(assignment.name).collection(constants.SUBMISSIONS_TABLE).doc(coursework.student_id).set(coursework);
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
    let doc = await db.collection(constants.COURSES_REGISTRATION_TABLE).doc(assignment.id).collection(constants.SUBMISSIONS_TABLE).doc(assignment.name).get();
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
