const FileService = require("./fileService");

module.exports = class CourseService {

    constructor () { }

    async fetchCourseById(course_id) {

    }

    async fetchCourseByClassAndId(course_id, class_id) {

    }

    async fetchCourseByTeacherId(teacher_id) {

    }

    async fetchCourseByStudentId(student_id) {

    }

    async fetchClassByStudentId(student_id) { }

    async fetchClassByTeacherId(teacher_id) { }

    async fetchClassBySemester(semester, course_id, class_id) { }

    async addClass(class_obj) { }

    async editClass(class_id, class_obj) { }

    async deleteClass(class_id) { }
};
