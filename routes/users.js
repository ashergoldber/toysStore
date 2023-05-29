const express = require("express");
const bcrypt = require("bcrypt");
const { validUser, UserModel, validLogin, createToken } = require("../models/userModel");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.get("/", async(req,res) => {
  const data = await UserModel.find({},{password:0});
  res.json(data);
})

// user info by token
router.get("/userInfo", auth,async(req,res) => {
  try{
    const user = await UserModel.findOne({_id:req.tokenData._id}, {password:0})
    res.json(user)
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

// add user
router.post("/signUp", async(req,res) => {
  const validBody = validUser(req.body);
  if (validBody.error) {
    res.status(400).json(validBody.error.details);
  }
  try{
    const user = new UserModel(req.body);
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    user.password = "*****";
    res.status(201).json(user)
  }
  catch(err){
    // check double email
    if (err.code == 11000) {
      return res.status(401).json({err_msg:"Email alredy in system", code:11000})
    }
    console.log(err);
    res.status(502).json({err})
  }
})

// login 
router.post("/login", async(req,res) => {
  const validBody = validLogin(req.body);
  if (validBody.error) {
    res.status(400).json(validBody.error.details);
  }
  try{
    // check if email exist in data
    const user = await UserModel.findOne({email:req.body.email});
    if (!user) {
      return res.status(401).json({err_msg:"Email not found"});
    }
    // check if password match
    const passordValid = await bcrypt.compare(req.body.password, user.password);
    if (!passordValid) {
      return res.status(401).json({err_msg:"Password wrong"});
    }
    const token = createToken(user._id, user.role);
    // send token back
    res.status(201).json({token, role:user.role})
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})
module.exports = router;