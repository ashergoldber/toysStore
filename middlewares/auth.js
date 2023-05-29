const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");

exports.auth = (req,res,next) => {
    const token = req.header("x-api-key");
    if(!token){
        return res.status(401).json({err_msg:"You must sent token to this endpoint"})
    }
    try{
        // decoding token and send it to next function
        const decodeToken = jwt.verify(token, config.tokenSecret);
        req.tokenData = decodeToken;
        console.log(decodeToken);
        next()
    }
    catch(err){
        console.log(err);
        res.status(401).json({err_msg:"Token invalid or expired"})
    }
}