const db = require("./db.js");

let listarSalas = async ()=>{
  try {
    const salas = await db.findAll("salas", {}); // Consulte todas as salas no banco de dados

    return salas;
  } catch (error) {
    throw error;
  }
    // let salas = await db.findAll("salas");
    // return salas;
}

let buscarSala = async (idsala)=>{
	return db.findOne("salas",idsala);
}
  
let criarSala = async (sala) => {
    return await db.insertOne("salas", sala);
  }

  let atualizarMensagens=async (sala)=>{
    return await db.updateOne("salas", sala,{_id:sala._id});
  }

  let buscarMensagens = async (idsala, timestamp)=>{
    let sala = await buscarSala(idsala);
    if(sala.msgs){
      let msgs=[];
      sala.msgs.forEach((msg)=>{
        if(msg.timestamp >= timestamp){
          msgs.push(msg);
        }
      });
      return msgs;
    }
    return [];
}

  

module.exports = {listarSalas, buscarSala, criarSala, buscarMensagens, atualizarMensagens }
