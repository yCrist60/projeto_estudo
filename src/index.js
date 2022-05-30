const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan("combined"));

const urldb =
  "mongodb+srv://edilson:Alunos123@projetobanco.syyui.mongodb.net/dbinfra?retryWrites=true&w=majority";

mongoose.connect(urldb, { useNewUrlParser: true, useUnifiedTopology: true });

const schema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  cpf: { type: String, unique: true, required: true },
  telefone: { type: String },
  idade: { type: Number, min: 16, max: 120 },
  usuario: { type: String, unique: true },
  senha: { type: String },
  datacadastro: { type: Date, default: Date.now },
});

const Cliente = mongoose.model("Cliente", schema);

app.get("/", (req, res) => {
  Cliente.find((erro, dados) => {
    if (erro)
      return res
        .status(500)
        .send({ output: `Erro ao processar dados -> ${erro}` });
    res.status(200).send({ output: "ok", payload: dados });
  });
});

app.post("/cadastro", (req, res) => {
  const dados = new Cliente(req.body);
  dados
    .save()
    .then((result) => {
      res.status(201).send({ output: "Cadastro realizado", payload: result });
    })
    .catch((erro) =>
      res.status(500).send({ output: `Erro ao cadastrar -> ${erro}` })
    );
});

app.put("/atualizar/:id", (req, res) => {
  Cliente.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (erro, dados) => {
      if (erro)
        return res
          .status(500)
          .send({ output: `Erro ao processar a atualização-> ${erro}` });
      if (!dados)
        return res
          .status(400)
          .send({ output: `Não foi possível atualizar -> ${erro}` });
      return res.status(202).send({ output: "Atualizado", payload: dados });
    }
  );
});

app.delete("/apagar/:id", (req, res) => {
  Cliente.findByIdAndDelete(req.params.id, (erro, dados) => {
    if (erro)
      return res
        .status(500)
        .send({ output: `Erro ao tentar apagar -> ${erro}` });
    res.status(204).send({});
  });
});

app.use((req, res) => {
  res.type("application/json");
  res.status(404).send("404 - Not Found");
});

app.listen(3000, () =>
  console.log(`Servidor on-line. em http://localhost:3000`)
);
