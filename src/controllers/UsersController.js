const {prisma} = require ('../db.js');
const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken');
//const {cookieParser} = require ('../index.js');

if(process.env.NODE_ENV !== "production"){
    require ('dotenv/config');
}

const {KEY} = process.env;

const register = async (req,res)=>{
    try {
        if(!req.body){
            res.status(400).send("Debes indicar el usuario y password");
        }

        const {nameUser, correo, password} = req.body;

        if(!(nameUser && correo && password)){
            res.status(400).send("Debes indicar el usuario y password");
        }

        const userExist = await prisma.user.findFirst({
            where:{
                OR: [
                    {correo : correo},
                    {nameUser : nameUser}
                ]
            }
        });

        if(userExist){
            res.status(400).send("EL usuario existe, iniciar sesion con otro correo o nombre de usuario");
        }

        const encryptedPassword = await bcrypt.hash(password,10);

        const createUser = await prisma.user.create({
            data:{

                nameUser: nameUser,
                correo : correo,
                password: encryptedPassword
            }

            
        });
        return res.status(201).json({message: "Usuario registrado con exito"});

    } catch (error) {
        console.log("Ha ocurrido un error", error);
        return res.status(500).send("Error en el servidor");
    }
    
};

const login = async (req,res)=>{
    try {
        const {nameUser, password} = req.body;

        if(!(nameUser && password)){
            return res.status(400).send("Indica mail y contraseña");
        }

        const user = await prisma.user.findFirst({
            where:{nameUser : nameUser}
        });
        
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({id: user.id, nameUser:user.nameUser}, KEY, {expiresIn: "1h"});
            user.token = token;
           
            
            res.cookie('acces_token', token, {
                htppOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 1
            })

            return res.status(200).json({
                id: user.id,
                nameUser: user.nameUser,
                correo: user.correo,
                token: token,
                
            });

        }else{
            return res.status(403).send("Credenciales invalidas");
            
        }


    } catch (error) {
        console.log("Ha ocurrido un error");
        return res.status(500).send("Error en el servidor");
    }
    
}

module.exports = {register,login};