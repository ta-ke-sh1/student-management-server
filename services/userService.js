const { fetchDataById, addData, deleteData, setData, updateData, fetchMatchingDataByField } = require("../repository/firebaseRepository");
const UserRepository = require("../repository/userRepository");
const constants = require("../utils/constants");
const { GradingService } = require("./gradingService");
const SubjectService = require("./subjectService");

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
    return await this.userRepository.fetchAllLecturersByDepartment(department)
  }

  async fetchAllUsers(type) {
    return await this.userRepository.fetchAllUsers(type);
  }

  async deactivateUser(id) {
    return await this.userRepository.deactivateUser(id);
  }


  async editUser(User_id, User_obj) {
    const res = await updateData(constants.USERS_TABLE, User_id, User_obj);
    return res;
  }

  async deleteUser(User_id) {
    const res = await deleteData(constants.USERS_TABLE, User_id);
    return res;
  }

  async addUser(User_obj) {
    const res = await addData(constants.USERS_TABLE, User_obj);
    return res;
  }

  async fetchUserById(username) {
    if (!username) {
      throw "Missing username!";
    }
    let user = await fetchMatchingDataByField(constants.ADMINS_TABLE, "__name__", username);
    if (user === -1) {
      user = await fetchMatchingDataByField(constants.LECTURERS_TABLE, "__name__", username);
      if (user === -1) {
        user = await fetchMatchingDataByField(constants.STUDENTS_TABLE, "__name__", username);
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
    if (!username) {
      throw "Missing username!";
    }
    let user = await fetchMatchingDataByField(constants.ADMINS_TABLE, "username", username);
    if (user === -1) {
      user = await fetchMatchingDataByField(constants.LECTURERS_TABLE, "username", username);
      if (user === -1) {
        user = await fetchMatchingDataByField(constants.STUDENTS_TABLE, "username", username);
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

  async fetchUserCurricullum(id) {
    if (!id) {
      throw "Missing parameter!: ID"
    }

    let student = await this.userRepository.fetchStudentById(id);
    if (student === -1) {
      throw "Student does not exist in database!";
    }

    let curricullum = await this.subjectService.fetchAllSubjectsByDepartment(student.department_id);
    let grades = await this.gradingService.fetchAllGradesByStudentId(student.id);

    console.log(curricullum)
    console.log(grades)

    let res = [];
    curricullum.forEach((subject) => {
      let flag = false;

      if (grades !== -1) {
        grades.forEach((grade) => {
          if (subject.id == grade.subject) {
            res.push({
              id: id,
              subject: subject.id,
              name: subject.name,
              grade: grade.grade,
            });
            flag = true;
          }
        });
      }

      if (!flag) {
        res.push({
          id: subject.id,
          student_id: id,
          name: subject.name,
          grade: "Not yet",
        });
      }
    });

    return res;
  }
};

module.exports = { UserService };
