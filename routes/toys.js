const express = require("express");
const { auth } = require("../middlewares/auth");
const { validToy, ToyModel } = require("../models/toyModel");
const router = express.Router();


// get all toys or search by query
router.get("/", async(req,res) => {
  try{
    const perPage = req.query.perPage || 6;
    const page = req.query.page -1 || 0;
    const sort = req.query.sort || "_id";
    const reverse = req.query.reverse == "yes" ? 1 : -1;
    const cat = req.query.cat; // search by category name
    const search = req.query.s;
    let filterFind = {};
    if (cat) {
      const categoryRegex = new RegExp(cat, "i");
      filterFind = {category:categoryRegex};
    }
    if (search) {
      const searchExp = new RegExp(search, "i");
      filterFind = {$or:[{name:searchExp},{info:searchExp}]}
    }
    const data = await ToyModel
    .find(filterFind)
    .limit(perPage)
    .skip(page * perPage)
    .sort({[sort]:reverse});
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }

})

// get by price (min-max)
router.get("/price", async(req,res) => {
  const min = req.query.min || 0;
  const max = req.query.max || Infinity;
  try{
    const data = await ToyModel 
    .find({price:{$gte:min, $lte:max}});
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

// get single toy by id
router.get("/single/:id", async(req,res)=>{
  try{
    const id = req.params.singleId;
    const data = await ToyModel.findOne({_id:id});
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

// add toy
router.post("/", auth, async(req,res) => {
  const validBody = validToy(req.body);
  if (validBody.error) {
    return res.status(401).json(validBody.error.details);
  }
  try{
    const toy = await new ToyModel(req.body);
    toy.user_id = req.tokenData._id;
    await toy.save();
    res.status(201).json(toy)
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})
// delete toy
router.delete("/:idDel", auth, async(req,res) => {
  try{
    const id = req.params.id;
    const data = await ToyModel.deleteOne({_id:id, user_id:req.tokenData._id});
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})
// edit toy
router.put("/:id", auth, async(req,res) =>{
  const validBody = validToy(req.body);
  if (validBody.error) {
    return res.status(401).json(validBody.error.details);
  }
  try{
    const id = req.params.id;
    const data = await ToyModel.updateOne({_id:id,user_id:req.tokenData._id},req.body);
    res.status(201).json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

module.exports = router;