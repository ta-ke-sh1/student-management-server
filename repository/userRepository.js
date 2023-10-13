const constants = require("../utils/constants");
const { addData, updateData, db, fetchAllData } = require("./firebaseRepository");

module.exports = class UserRepository {
  async addAdmin(data) {
    return await addData(constants.ADMINS_TABLE, data);
  }

  async addStudent(data) {
    return await addData(constants.STUDENTS_TABLE, data);
  }

  async addStudent(data) {
    return await addData(constants.LECTURERS_TABLE, data);
  }

  async fetchAllUsers(type) {
    let table;
    switch (type) {
      case "student":
        table = constants.STUDENTS_TABLE;
        break;
      case "lecturer":
        table = constants.LECTURERS_TABLE;
        break;
      case "admin":
        table = constants.ADMINS_TABLE;
        break;
      default:
        break;
    }
    return await fetchAllData(table);
  }

  async updateUserStatus(user_id, type, status) {
    let table;
    switch (type) {
      case "Student":
        table = constants.STUDENTS_TABLE;
        break;
      case "Teacher":
        table = constants.TEACHERS_TABLE;
        break;
      case "Admin":
        table = constants.ADMINS_TABLE;
        break;
      default:
        break;
    }
    if (table) {
      return await updateData(constants.USERS_TABLE, user_id, {
        status: status,
      });
    } else {
      throw Error("Invalid user type");
    }
  }

  async updateUserDetails(user, type) {
    let table;
    switch (type) {
      case "Student":
        table = constants.STUDENTS_TABLE;
        break;
      case "Teacher":
        table = constants.TEACHERS_TABLE;
        break;
      case "Admin":
        table = constants.ADMINS_TABLE;
        break;
      default:
        break;
    }
    if (table) {
      return await updateData(constants.USERS_TABLE, user.id, {
        dob: user.dob,
        address: user.address,
        phone: user.phone,
        email: user.email,
        department_id: user.department_id,
      });
    } else {
      throw Error("Invalid user type");
    }
  }

  async updateAvatar(user, type, avatar) {
    let table;
    switch (type) {
      case "Student":
        table = constants.STUDENTS_TABLE;
        break;
      case "Teacher":
        table = constants.TEACHERS_TABLE;
        break;
      case "Admin":
        table = constants.ADMINS_TABLE;
        break;
      default:
        break;
    }
    if (table) {
      return await updateData(constants.USERS_TABLE, user.id, { avatar: avatar });
    } else {
      throw Error("Invalid user type");
    }
  }
};
