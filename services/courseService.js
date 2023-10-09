const CourseRepostory = require("../repository/courseRepository");
const Utils = require("../utils/utils");
const ClassService = require("./classService");
const { UserService } = require("./userService");

const path = require("path");

module.exports = class CourseService {
  courseRepository;
  userService;
  utils;

  constructor() {
    this.courseRepository = new CourseRepostory();
    this.userService = new UserService();
    this.classService = new ClassService();
    this.utils = new Utils();
  }

  async fetchCourseByCampus(campus_id) {
    return [];
    // return await this.courseRepository.fetchCourseRegistrationByStudentIdAndSemester(
    // campus_id
    // );
  }

  async fetchCourseById(course_id) {}

  async fetchCourseByClassAndId(course_id, class_id) {}

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

  async fetchClassBySemester(semester, course_id, class_id) {}

  async addClass(class_obj) {}

  async editClass(class_id, class_obj) {}

  async deleteClass(class_id) {}
};
