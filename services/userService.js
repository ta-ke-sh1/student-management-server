const { fetchDataById, addData, deleteData, setData, updateData, fetchMatchingDataByField } = require("../repository/firebaseRepository");
const UserRepository = require("../repository/userRepository");
const constants = require("../utils/constants");

const userRepository = new UserRepository();

const UserService = class {
  async fetchAllUsers(type) {
    return await userRepository.fetchAllUsers(type);
  }

  async deactivateUser(id) {
    return await userRepository.deactivateUser(id);
  }

  async fetchAllUsersByCampus(campus) {
    const Users = await fetchMatchingDataByField(constants.USERS_TABLE, "campus", campus);
    return Users;
  }

  async fetchAllUsersByAcademicYear(year) {
    const Users = await fetchMatchingDataByField(constants.USERS_TABLE, "campus", campus);
    return Users;
  }

  async fetchAllUsersByClassId(classId) {
    const Users = await fetchMatchingDataByField(constants.USERS_TABLE, "campus", campus);
    return Users;
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

  async fetchUserById(User_id) {
    if (!User_id) {
      throw "Invalid User id!";
    }
    let user = await fetchDataById(constants.USERS_TABLE, User_id);
    if (user === -1) {
      throw "User does not exist";
    }

    return {
      status: true,
      data: user,
    };
  }

  async fetchUserByUsername(username) {
    if (!username) {
      throw "Missing username!";
    }
    let user = await fetchMatchingDataByField(constants.ADMINS_TABLE, "username", username);
    if (user === -1) {
      user = await fetchMatchingDataByField(constants.LECTURERS_TABLE_TABLE, "username", username);
      if (user === -1) {
        user = await fetchMatchingDataByField(constants.STUDENTS_TABLE_TABLE, "username", username);
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
};

module.exports = { UserService };
