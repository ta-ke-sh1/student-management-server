const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { fetchDataById } = require('../services/database');
const constants = require('../utils/constants');

const authorize = async (username, password) => {

    var u = await fetchDataById(constants.USERS_TABLE, username).data;
    if (!u) {
        return {
            code: 406,
            message: "User does not exists!",
        };
    }

    if (!bcrypt.compareSync(password, u.password)) {
        return {
            code: 406,
            message: "Incorrect password!",
        };
    }

    var access_secret = process.env.JWT_SECRET_KEY;
    const accessToken = jwt.sign(
        {
            avatar: u.avatar,
            user: username,
            email: u.email,
            role: u.role,
        },
        access_secret,
        { expiresIn: "1d" }
    );
    var refresh_secret = process.env.JWT_SECRET_KEY;
    const refreshToken = jwt.sign(
        {
            user: user.id,
        },
        refresh_secret,
        { expiresIn: "2d" }
    )
    return {
        code: 200,
        accessToken: "Bearer " + accessToken,
        refreshToken: "Bearer " + refreshToken,
    };
};

module.exports = { authorize }