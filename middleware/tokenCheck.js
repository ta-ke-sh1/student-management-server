const jwt = require("jsonwebtoken");

function containsRole(role) {
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

module.exports = { containsRole };
