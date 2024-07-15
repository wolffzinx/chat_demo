const db = require("./db");

let listarSalas = async ()=>{
    let salas = await db.findAll("salas");
    return salas
};

exports.get=async(req,res)=>{ 
    const salaModel = require('../models/salaModels');
    return salaModel.listarSalas();
}