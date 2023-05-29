const mongoose = require("mongoose");
const Joi = require("joi");

const toySchema = new mongoose.Schema({
    name: String,
    info: String,
    category: String,
    img_url: String,
    price: Number,
    user_id: String,
},{timestamps: true});

exports.ToyModel = mongoose.model("toys", toySchema);

exports.validToy = (reqBody) => {
    const joiSchema = Joi.object({
        name:Joi.string().min(3).max(15).required(),
        info:Joi.string().min(5).max(100).required(),
        category:Joi.string().min(3).max(15).required(),
        img_url:Joi.string().min(3).max(9999).allow(null, ""), // not required
        price:Joi.number().min(1).max(9999).required(),
    })
    return joiSchema.validate(reqBody);
}