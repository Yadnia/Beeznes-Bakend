const express = require('express');
const http = require ('http');
const app= express();
const server = http.createServer(app);
const UserRoutes = require('./routes/Users');

//validar si el entorno es de produccion
if(process.env.NODE_ENV !== "production"){
    require ('dotenv/config');
}

const {PORT} = process.env;

app.use(express.json());

UserRoutes(app);

server.listen(PORT, ()=>{
    console.log("El servidor esta corriendo en el puerto", PORT)
})