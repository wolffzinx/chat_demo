const salaModel = require('../models/salaModel');

// Rota para listar as salas
router.get("/sala/listar", async (req, res) => {
  try {
    // Chame o método do modelo para buscar todas as salas no banco de dados
    const salas = await salaModel.listarSalas();

    // Verifique se existem salas disponíveis
    if (salas.length > 0) {
      return res.status(200).send({ salas });
    } else {
      return res.status(404).send({ msg: "Nenhuma sala encontrada" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Erro ao listar salas" });
  }
});