const jwt = require("jsonwebtoken");
const User = require("../models/User.model")

const isAuthenticated = (req, res, next) => {
    try {
        if (req.headers.authorization?.split(" ")[0] === "Bearer") { /* checks if the authorization header
            exists in the request and whether is starts with 'Bearer' */
            const token = request.headers.authorization.split(" ")[1]; // extracts the token from the authorization header, which follows the format "Bearer <token>"
            const payload = jwt.verify(token, process.env.TOKEN_SECRET); /* the jwt.verify() method is used to decode the JWT token using the provided secret. 
            If the token is valid, the payload is decoded. */
            req.tokenPayload = payload;
            next();
          } else {
            throw new Error("No token");
          }

    } catch (err) {
        res.status(401).json("Token not provided or not valid")
    }
}

module.exports = { isAuthenticated }