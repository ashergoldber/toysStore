const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role:{
        type:String, default:"user"
    }
},{timestamps: true})

exports.UserModel = mongoose.model("users", userSchema);

exports.createToken = (user_id, role = "user") => {
    const token = jwt.sign(
        {_id:user_id, role},
        config.tokenSecret,
        {expiresIn:"600mins"}
    )
    return token;
}

exports.validUser = (reqBody) => {
    const joiSchema = Joi.object({
        name:Joi.string().min(3).max(15).required(),
        email:Joi.string().min(8).max(50).email().required(),
        password:Joi.string().min(3).max(15).required()
    })
    return joiSchema.validate(reqBody);
}

exports.validLogin = (reqBody) => {
    const joiSchema = Joi.object({
        email:Joi.string().min(8).max(50).email().required(),
        password:Joi.string().min(3).max(15).required()
    })
    return joiSchema.validate(reqBody);
}

// valid login
