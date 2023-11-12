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
      snapshots = await db.collection(constants.COURSES_REGISTRATION_TABLE).where("student_id", "==", id).get()

      let courses = snapshotToArray(snapshots);

      for (const i in courses) {
        let snapshot = await db.collection(constants.CLASS_TABLE).doc(courses[i].group_id).get();
        const group = {
          id: snapshot.id,
          ...snapshot.data(),
        }
        const data = {
          ...courses[i],
          ...group
        }
        results.push(data)
      }
    }
    else if (role === 2) {
      snapshots = await db.collection(constants.CLASS_TABLE).where("lecturer", "==", id).get()
      results = snapshotToArray(snapshots);
    }
    else {
      throw "Invalid role";
    }
    return results;
  }

  async fetchCourseById(id) {
    let course = await this.courseRepository.fetchCourseByProgrammeAndTermAndDepartmentAndId(id);
    let assignments = await this.courseRepository.fetchAssignmentsByCourse(id);
    course.assignments = assignments;
    return course;
  }

  async fetchCourseByClassAndId(course_id, class_id) { }

  async fetchCourseByUserIdAndCourseId(semester, user_id, course_id) {
    let course = await this.courseRepository.fetchCourseByUserIdAndCourseId(semester, user_id, course_id);
    return course;
  }

  async submitAssignment(submission) {
    console.log(submission);
    let response = await this.courseRepository.addSubmission(submission);
    return response;
  }

  async deleteLocalResourceByQuery(query) {
    let file_path = "asset\\course\\resources\\" + query.programme + "\\" + query.semester + "\\" + query.course + "\\" + query.group + "\\" + query.file;
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
    return this.submissionRepository.fetchSubmissionByCourseIdAndUserAndAssignmentId(id, user, asm);
  }

  async addCourseAssignment(assignment) {
    return this.courseRepository.addCourseAssignment(assignment);
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

  async fetchAssignmentsByCourseIdAndAssignmentId(course_id, assignment_id) {
    return this.submissionRepository.fetchAssignmentsByCourseIdAndAssignmentId(course_id, assignment_id);
  }
};
