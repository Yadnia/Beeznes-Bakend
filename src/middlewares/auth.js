const jwt = require ('jsonwebtoken');

if(process.env.NODE_ENV !== "production"){
    require ('dotenv/config');
}

const {KEY} = process.env;

const verifyToken = (req,res,next) =>{
    const token = req.headers["x-acess-token"];

    if(!token){
        return res.status(403).send("No se a enviado el token");
    }
    try {
        const decoded = jwt.verify(token,KEY);
        req.user = decoded;
    } catch (error) {
        return res.status(401).send("token invalido");
    }
    return next();
}

module.exports = verifyToken;