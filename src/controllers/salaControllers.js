const salaModel = require('../models/salaModel');
const usuarioModel = require('../models/usuarioModel');

exports.get = async (req, res) => {
    try {
        const salas = await salaModel.listarSalas();
        return res.status(200).send(salas);
    } catch (error) {
        console.error("Erro ao listar salas:", error);
        return res.status(500).send({ msg: "Erro ao listar salas" });
    }
};

exports.entrar = async (iduser, idsala) => {
    try {
        const sala = await salaModel.buscarSala(idsala);
        if (!sala) {
            console.log(`Sala com id ${idsala} não encontrada.`);
            return false;
        }

        const user = await usuarioModel.buscarUsuario(iduser);
        if (!user) {
            console.log(`Usuário com id ${iduser} não encontrado.`);
            return false;
        }

        user.sala = {
            _id: sala._id,
            nome: sala.nome,
            tipo: sala.tipo
        };

        const atualizado = await usuarioModel.alterarUsuario(user);
        if (atualizado) {
            return { msg: "OK", timestamp: Date.now() };
        }

        return false;
    } catch (error) {
        console.error("Erro ao entrar na sala:", error);
        return false;
    }
};

exports.criarSala = async (nome, tipo) => {
    try {
        const sala = {
            nome: nome,
            tipo: tipo,
            msgs: []
        };

        const novaSala = await salaModel.criarSala(sala);
        return novaSala;
    } catch (error) {
        console.error("Erro ao criar sala:", error);
        return null;
    }
};

exports.enviarMensagem = async (nick, msg, idsala) => {
    try {
        const sala = await salaModel.buscarSala(idsala);
        if (!sala) {
            console.log(`Sala com id ${idsala} não encontrada.`);
            return { msg: "Sala não encontrada" };
        }

        if (!sala.msgs) {
            sala.msgs = [];
        }

        const timestamp = Date.now();
        sala.msgs.push({
            timestamp: timestamp,
            msg: msg,
            nick: nick
        });

        await salaModel.atualizarMensagens(sala);
        return { msg: "OK", timestamp: timestamp };
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
        return { msg: "Erro ao enviar mensagem" };
    }
};

exports.buscarMensagens = async (idsala, timestamp) => {
    try {
        const mensagens = await salaModel.buscarMensagens(idsala, timestamp);
        if (mensagens.length === 0) {
            return { timestamp: Date.now(), msgs: [] };
        }

        return {
            timestamp: mensagens[mensagens.length - 1].timestamp,
            msgs: mensagens
        };
    } catch (error) {
        console.error("Erro ao buscar mensagens:", error);
        return { timestamp: Date.now(), msgs: [] };
    }
};

exports.sairSala = async (idsala, iduser) => {
    try {
        const user = await usuarioModel.buscarUsuario(iduser);
        if (!user) {
            console.log(`Usuário com id ${iduser} não encontrado.`);
            return false;
        }

        const resp = await this.enviarMensagem(user.nick, "Sai da sala!", idsala);
        if (!resp || resp.msg !== "OK") {
            return false;
        }

        delete user.sala;
        const atualizado = await usuarioModel.alterarUsuario(user);

        if (atualizado) {
            return { msg: "OK", timestamp: Date.now() };
        }

        return false;
    } catch (error) {
        console.error("Erro ao sair da sala:", error);
        return false;
    }
};
