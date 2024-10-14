const express = require('express');
const http = require ('http');
const app= express();
const server = http.createServer(app);

//validar si el entorno es de produccion
if(process.env.Node_ENV !== "production"){
    require ('dotenv/config');
}

const {PORT} = process.env;

app.use(express.json());
server.listen(PORT, ()=>{
    console.log("El servidor esta corriendo en el puerto", PORT)
})