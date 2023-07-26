const { UserService } = require("./userService")
const jwt = require("jsonwebtoken")

module.exports = class AuthService {

    constructor () {
        this.userService = new UserService();
    }

    authenticate = async (username, password) => {
        let user = await this.userService.fetchUserByUsername(username)
        if (!user) {
            return {
                error: "User does not exists!"
            }
        }

        if (user.password !== password) {
            return {
                error: "Incorrect password!"
            }
        }

        var access_token = jwt.sign({
            avatar: user.avatar,
            user: username,
            email: user.email,
            role: user.role,
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: "1d"
        })

        var refresh_token = jwt.sign({
            user: user.id
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: "2d"
        })

        return {
            accessToken: "Bearer " + access_token,
            refreshToken: "Bearer " + refresh_token,
        }
    }

    containsRole(role) {
        return function middle(req, res, next) {
            var token = req.get("Authorization");
            if (token === undefined) {
                res.status(401).send({
                    success: false,
                    message: "No Token Provided.",
                });
                return;
            }

            if (!token.startsWith("Bearer ")) {
                res.status(400).send({
                    success: false,
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
                res.status(406).send({ success: false, message: err });
                return;
            }

            if (!decoded.role.includes(role)) {
                res.status(401).send({
                    success: false,
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
}