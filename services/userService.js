const { fetchDataById, addData, deleteData, setData, updateData, fetchMatchingDataByField } = require("../repository/firebaseRepository")
const constants = require("../utils/constants");

const UserService = class {

    async getAllUsersByCampus(campus) {
        const Users = await fetchMatchingDataByField(constants.USERS_TABLE, "campus", campus)
        return Users;
    }

    async getAllUsersByAcademicYear(year) {
        const Users = await fetchMatchingDataByField(constants.USERS_TABLE, "campus", campus)
        return Users;
    }

    async getAllUsersByClassId(classId) {
        const Users = await fetchMatchingDataByField(constants.USERS_TABLE, "campus", campus)
        return Users;
    }

    async editUser(User_id, User_obj) {
        const res = await updateData(constants.USERS_TABLE, User_id, User_obj)
        return res;
    }

    async deleteUser(User_id) {
        const res = await deleteData(constants.USERS_TABLE, User_id)
        return res;
    }

    async addUser(User_obj) {
        const res = await addData(constants.USERS_TABLE, User_obj)
        return res;
    }

    async getUserById(User_id) {
        if (!User_id) {
            return {
                error: "Invalid User id!"
            }
        }
        let user = await fetchDataById(constants.USERS_TABLE, User_id);
        if (user === -1) {
            return {
                error: "User does not exist"
            }
        }
        return user;
    }
}

module.exports = { UserService }