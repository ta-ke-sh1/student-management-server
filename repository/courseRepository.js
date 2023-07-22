const constants = require("../utils/constants");
const {
    addData,
    deleteData,
    updateData,
    fetchMatchingDataByField,
    fetchAllData,
} = require("./firebaseRepository");

module.exports = class CourseRepostory {
    constructor () { }

    async fetchCourseRegistrationByCampusId(campus_id) {
        return [
            {
                id: "HdYSObbNePFj5uF7MtNj",
                className: "TCH2101",
                courseId: "1680",
                courseName: "Design Pattern",
                teacher: "Doan Tran Tung",
                campus_id: "HaNoi",
                semester: "Fall_2022"
            },
            {
                id: "1dYSObbNePFj5uF7MtNj",
                className: "TCH2101",
                courseId: "1686",
                courseName: "Advanced Computing",
                teacher: "Doan Tran Tung",
                campus_id: "HaNoi",
                semester: "Fall_2022"
            },
            {
                id: "2dYSObbNePFj5uF7MtNj",
                className: "TCH2101",
                courseId: "1520",
                courseName: "Cloud Computing",
                teacher: "Doan Tran Tung",
                campus_id: "HaNoi",
                semester: "Summer_2022"
            },
            {
                id: "3dYSObbNePFj5uF7MtNj",
                className: "TCH2101",
                courseId: "1540",
                courseName: "Research Methodologies",
                teacher: "Doan Tran Tung",
                campus_id: "HaNoi",
                semester: "Spring_2022"
            },
        ];
        // return await fetchMatchingDataByField(
        //     constants.COURSES_TABLE,
        //     "campus_id",
        //     campus_id
        // );
    }

    async submitCourseworkSubmission(coursework) {
        return await addData(constants.SUBMISSIONS_TABLE, coursework);
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

    async uploadSubmission(course, submissionFile) { }
};
