const { refreshToken } = require("firebase-admin/app");
const { UserService } = require("./userService");
const jwt = require("jsonwebtoken");
const CourseService = require("./courseService");

module.exports = class AuthService {
    constructor() {
        this.courseService = new CourseService();
        this.userService = new UserService();
    }

    signToken = async (username, user) => {
        let courses = await this.courseService.fetchUserCourseById(user.id);
        console.log(courses);

        var access_token = jwt.sign(
            {
                id: user.id,
                avatar: user.avatar ?? "default.jpg",
                user: username,
                email: user.email,
                role: user.role,
                courses: courses,
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "1d",
            }
        );

        var refresh_token = jwt.sign(
            {
                user: username,
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "2d",
            }
        );

        return {
            accessToken: "Bearer " + access_token,
            refreshToken: "Bearer " + refresh_token,
        };
    };

    refresh = async (refreshToken) => {
        let valid = jwt.verify(refreshToken);

        if (valid) {
            let decoded = jwt.decode(refreshToken);
            let res = await this.userService.fetchUserByUsername(username);
            let newToken = await this.signToken(decoded.username, res[0]);

            return {
                accessToken: newToken.accessToken,
                refreshToken: refreshToken,
            };
        } else {
            throw "Invalid refresh token!";
        }
    };

    authenticate = async (username, password) => {
        let userService = new UserService();
        console.log("authenticate");
        const user = await userService.fetchUserByUsername(username);

        if (user.password !== password) {
            throw "Incorrect Password!";
        }

        return await this.signToken(username, user);
    };

    containsRole(role) {
        return function middle(req, res, next) {
            var token = req.get("Authorization");
            if (token === undefined) {
                res.status(401).send({
                    status: false,
                    message: "No Token Provided.",
                });
                return;
            }

            if (!token.startsWith("Bearer ")) {
                res.status(400).send({
                    status: false,
                    message: "Invalid token format.",
                });
                return;
            }

            try {
                var decoded = jwt.verify(
                    token.substring(7, token.length),
                    process.env.JWT_SECRET_ACCESS
                );
            } catch (err) {
                res.status(406).send({ status: false, message: err });
                return;
            }

            if (!decoded.role.includes(role)) {
                res.status(401).send({
                    status: false,
                    message: "You are unauthorized for this action!",
                });
            } else {
                var decoded = jwt.verify(
                    token.substring(7, token.length),
                    process.env.JWT_SECRET_ACCESS
                );
                req.decodedToken = decoded;
                next();
            }
        };
    }
};
