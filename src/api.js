let express = require("express");
let app = express();
const salaController = require("./controllers/salaController");
const usuarioController = require("./controllers/usuarioController");
const token = require("./util/token");

app.use(express.urlencoded({extended : true}));
app.use(express.json());

const router = express.Router();
app.use('/', router.get('/', (req, res)=>{
    res.status(200).send("<h1>API-CHAT</h1>")
}));

// Rota para ver versão do chat
app.use("/", router.get("/sobre", (resq, res, next) => {
    res.status(200).send({
        "nome":"API - CHAT",
        "versão": "0.1.0",
        "autor": "Lucas Wolff"
    })
}));

// Rota para criar sala
app.use("/salas/criar", router.post("/salas/criar", async (req, res) => {
    if (await token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick)) {
      let resp = await salaController.criarSala(req.body);
      res.status(200).send(resp);
    } else {
      res.status(400).send({ msg: "Usuário não autorizado" });
    }
  }));

  
  
  // Criar sala
app.use("/sala/criar", router.post("/sala/criar", async (req, res) => {
    if (!token.checkToken(req.body.token, req.body.iduser, req.body.nick)) {
      return res.status(400).send({ msg: "Usuário não autorizado" });
    }
  
    // Extrair os dados da requisição
    const { nome, tipo } = req.body;
  
    // Chamar o controller para criar a sala
    const sala = await salaController.criarSala(nome, tipo);
  
    if (sala) {
      return res.status(200).send({ msg: "Sala criada com sucesso", sala });
    } else {
      return res.status(500).send({ msg: "Erro ao criar sala" });
    }
  }));

  
//entrar usuario
app.use("/entrar",router.post("/entrar", async(req, res, next) => {
    const usuarioController = require("./controllers/usuarioController");
    let resp= await usuarioController.entrar(req.body.nick);
    res.status(200).send(resp);
}));

//Rota para listar salas

app.use("/salas", router.get("/salas", async (req, res, next) => {
  if (await token.checkToken(req.body.token, req.body.iduser, req.body.nick)) {
    let resp = await salaController.get();
    res.status(200).send(resp);
    console.log(resp);
  } else {
    res.status(400).send({ msg: "Usuário não autorizado" });
  }
}));

//entrar na sala
app.use("/sala/entrar", router.post("/sala/entrar", async (req, res)=>{
	if(!token.checkToken(req.body.token,req.body.iduser,req.body.nick)) 
    return false;
	let resp= await salaController.entrar(req.body.iduser, req.query.idsala);
	res.status(200).send(resp);
}));

app.use("/sala/mensagem/", router.post("/sala/mensagem", async (req, res) => {
  if(!token.checkToken(req.headers.token,req.headers.iduser,req.headers.nick)) return false;
  let resp= await salaController.enviarMensagem(req.headers.nick, req.body.msg,req.body.idSala);
  res.status(200).send(resp);
}));

app.use("/sala/mensagens/", router.get("/sala/mensagens", async (req, res) => {
  if(!token.checkToken(req.headers.token,req.headers.iduser,req.headers.nick)) return false;
  let resp= await salaController.buscarMensagens(req.query.idSala, req.query.timestamp);
  res.status(200).send(resp);
}))


app.use("/sala/sair/", router.put("/sala/sair", async (req, res) => {
	if(!token.checkToken(req.headers.token,req.headers.iduser,req.headers.nick)) return false;
	let resp= await salaController.sairSala(req.query.idsala, req.headers.iduser);
	res.status(200).send(resp);
}))


module.exports = app;