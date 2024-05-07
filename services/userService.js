const {
    fetchDataById,
    deleteData,
    setData,
    updateData,
    fetchMatchingDataByField,
} = require("../repository/firebaseRepository");
const UserRepository = require("../repository/userRepository");
const constants = require("../utils/constants");
const { GradingService } = require("./gradingService");
const SubjectService = require("./subjectService");
const CourseRepository = require("../repository/courseRepository");


const UserService = class {
    userRepository;
    subjectService;
    gradingService;

    constructor() {
        this.userRepository = new UserRepository();
        this.subjectService = new SubjectService();
        this.gradingService = new GradingService();
    }

    async fetchAllLecturersByDepartment(department) {
        return await this.userRepository.fetchAllLecturersByDepartment(
            department
        );
    }

    async fetchAllUsers(type) {
        return await this.userRepository.fetchAllUsers(type);
    }

    async deactivateUser(id, role) {
        return await this.userRepository.deleteUser(id, role)
    }

    fetchRole(role) {
        switch (role) {
            case 1:
                return constants.STUDENTS_TABLE;
            case 2:
                return constants.LECTURERS_TABLE;
            case 3:
                return constants.ADMINS_TABLE;
            case "1":
                return constants.STUDENTS_TABLE;
            case "2":
                return constants.LECTURERS_TABLE;
            case "3":
                return constants.ADMINS_TABLE;
            default:
                throw "Invalid role!";
        }
    }

    async editUser(user_id, user_obj) {
        const table = this.fetchRole(user_obj.role);

        const res = await updateData(table, user_id, user_obj);
        return res;
    }

    async deleteUser(User_id) {
        const res = await deleteData(constants.USERS_TABLE, User_id);
        return res;
    }

    async addUser(userData) {
        let user = {
            ...userData,
            avatar: "/avatar/default.jpg",
            status: true,
            password: "default",
        };

        let username = user.firstName.toLowerCase().replace(" ", "");
        let lastnames = user.lastName.split(" ");
        lastnames.forEach((name) => {
            username += name[0].toLowerCase();
        });

        switch (user.role) {
            case 1:
                this.checkUsernameValidityThenSetData(
                    user,
                    username,
                    constants.STUDENTS_TABLE
                );
                break;
            case 2:
                this.checkUsernameValidityThenSetData(
                    user,
                    username,
                    constants.LECTURERS_TABLE
                );
                break;
            case 3:
                this.checkUsernameValidityThenSetData(
                    user,
                    username,
                    constants.ADMINS_TABLE
                );
                break;
            default:
                throw "Invalid role";
        }
    }

    async checkUsernameValidityThenSetData(user, username, table) {
        let index = 1;
        let temp = String(username);
        while (true) {
            let user = await fetchDataById(table, temp);
            if (user === -1) {
                break;
            } else {
                temp = username + index.toString();
                index++;
            }
        }
        user.email =
            temp.toLowerCase() +
            user.department_id.toLowerCase() +
            "@fpt.edu.vn";
        temp.replace(" ", "");
        await setData(table, temp, user);
    }

    async fetchUserById(username) {
        if (!username) {
            throw "Missing username!";
        }
        let user = await fetchMatchingDataByField(
            constants.ADMINS_TABLE,
            "__name__",
            username
        );
        if (user === -1) {
            user = await fetchMatchingDataByField(
                constants.LECTURERS_TABLE,
                "__name__",
                username
            );
            if (user === -1) {
                user = await fetchMatchingDataByField(
                    constants.STUDENTS_TABLE,
                    "__name__",
                    username
                );
                if (user === -1) {
                    return false;
                } else {
                    user[0].role = 1;
                }
            } else {
                user[0].role = 2;
            }
        } else {
            user[0].role = 3;
        }
        return user;
    }

    async fetchUserByUsername(username) {
        console.log("Fetch user");
        if (!username) {
            throw "Missing username!";
        }

        let user = await fetchDataById(constants.ADMINS_TABLE, username);

        if (user === -1) {
            console.log("lecturer");
            user = await fetchDataById(constants.LECTURERS_TABLE, username);
            if (user === -1) {
                user = await fetchDataById(constants.STUDENTS_TABLE, username);
                if (user === -1) {
                    return false;
                } else {
                    user.role = 1;
                }
            } else {
                user.role = 2;
            }
        } else {
            user.role = 3;
        }
        return user;
    }

    async fetchUserCurricullum(id) {
        if (!id) {
            throw "Missing parameter!: ID";
        }

        let student = await this.userRepository.fetchStudentById(id);
        if (student === -1) {
            throw "Student does not exist in database!";
        }

        let curricullum =
            await this.subjectService.fetchAllSubjectsByDepartment(
                student.department_id
            );

        let grades = await this.gradingService.fetchAllGradesByStudentId(
            student.id
        );

        grades.sort((a, b) => a.date - b.date);

        const courseRepository = new CourseRepository()

        for (let i = 0; i < grades.length; i++) {
            let course = await courseRepository.fetchCourseById(grades[i].group_id);
            grades[i].subject_id = course.subject
            grades[i].assignments = course.assignments;
        }

        const res = [];

        for (let i = 0; i < curricullum.length; i++) {
            const grade = grades.find((grade) => curricullum[i].id === grade.subject_id)
            if (grade) {
                res.push({
                    course_id: grade.group_id,
                    id: curricullum[i].id,
                    student_id: id,
                    subject: curricullum[i].id,
                    name: curricullum[i].name,
                    grade: grade.grade,
                    gradeText: grade.gradeText
                });
            } else {
                res.push({
                    id: curricullum[i].id,
                    student_id: id,
                    name: curricullum[i].name,
                    gradeText: "Not Yet",
                    grade: "",
                });
            }
        }

        return res;
    }

    async updatePassword(user) {
        switch (user.role) {
            case 1:
                await updateData(constants.STUDENTS_TABLE, user.id, {
                    password: user.password
                })
                break;
            case 2:
                await updateData(constants.LECTURERS_TABLE, user.id, {
                    password: user.password
                })
                break;
            case 3:
                await updateData(constants.ADMINS_TABLE, user.id, {
                    password: user.password
                })
                break;
            default:
                throw "Invalid user role"
        }
    }

    async resetPassword(id, role) {
        let table;
        switch (role) {
            case 1:
                table = constants.STUDENTS_TABLE;
                break;
            case 2:
                table = constants.LECTURERS_TABLE;
                break;
            case 3:
                table = constants.ADMINS_TABLE;
                break;
            case "1":
                table = constants.STUDENTS_TABLE;
                break;
            case "2":
                table = constants.LECTURERS_TABLE;
                break;
            case "3":
                table = constants.ADMINS_TABLE;
                break;
            default:
                throw "Invalid role!";
        }
        const res = await updateData(table, id, { password: "default" });
        return res;
    }
};

module.exports = { UserService };
