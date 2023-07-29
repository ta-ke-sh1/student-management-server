const constants = require("../utils/constants");
const { addData, updateData } = require("./firebaseRepository");

module.exports = class UserRepository {
    async addUser(data) {
        return await addData(constants.USERS_TABLE, data);
    }

    async switchRole(user_id, role) {
        return await updateData(constants.USERS_TABLE, user_id, { role: role });
    }

    async switchUserStatus(user_id, status) {
        return await updateData(constants.USERS_TABLE, user_id, {
            status: status,
        });
    }

    async updateUserDetails(user) {
        return await updateData(constants.USERS_TABLE, user.id, {
            dob: user.dob,
            address: user.address,
            phone: user.phone,
            email: user.email,
            department_id: user.department_id,
        });
    }

    async updateAvatar(user, avatar) {}
};