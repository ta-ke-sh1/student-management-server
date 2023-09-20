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
        return []
        // return await this.courseRepository.fetchCourseRegistrationByStudentIdAndSemester(
        // campus_id
        // );
    }

    async fetchCourseById(course_id) { }

    async fetchCourseByClassAndId(course_id, class_id) { }

    async fetchCourseByUserIdAndCourseId(semester, user_id, course_id) {
        let course = await this.courseRepository.fetchCourseByUserIdAndCourseId(
            semester,
            user_id,
            course_id
        );
        return course;
    }

    async fetchClassBySemester(semester, course_id, class_id) { }

    async addClass(class_obj) { }

    async editClass(class_id, class_obj) { }

    async deleteClass(class_id) { }
};
