const CourseRepostory = require("../repository/courseRepository");
const ClassService = require("./classService");
const { UserService } = require("./userService");

module.exports = class CourseService {
    courseRepository;
    userService;

    constructor() {
        this.courseRepository = new CourseRepostory();
        this.userService = new UserService();
        this.classService = new ClassService();
    }

    async fetchCourseByCampus(campus_id) {
        return await this.courseRepository.fetchCourseRegistrationByCampusId(
            campus_id
        );
    }

    async fetchCourseById(course_id) {}

    async fetchCourseByClassAndId(course_id, class_id) {}

    async fetchCourseByTeacherId(teacher_id) {}

    async fetchCourseByStudentId(student_id) {}

    async fetchClassByStudentId(student_id) {}

    async fetchClassByTeacherId(teacher_id) {}

    async fetchClassBySemester(semester, course_id, class_id) {}

    async addClass(class_obj) {}

    async editClass(class_id, class_obj) {}

    async deleteClass(class_id) {}
};
