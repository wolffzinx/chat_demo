const db = require("./db");
async function registrarUsuario(nick){
    let user= await db.insertOne("usuario",{"nick": nick});
    return user;
}

let buscarUsuario = async (idUser)=>{
	let user = await db.findOne("usuarios",idUser);
	return user;
}

let alterarUsuario = async (user)=>{
	return await db.updateOne("usuarios", user,{_id:user._id});
}


module.exports = {registrarUsuario, buscarUsuario, alterarUsuario}