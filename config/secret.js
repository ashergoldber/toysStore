require("dotenv").config();

exports.config = {
    tokenSecret: process.env.TOKEN_SECRET,
    userDb: process.env.USER_DB,
    passwordDb: process.env.PASSWORD_DB   
}