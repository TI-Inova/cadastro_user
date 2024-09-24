const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const cors = require('cors'); // Adicionar CORS
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar o CORS para permitir requisições de qualquer origem
app.use(cors()); // Adicionando middleware CORS

// Configurar o servidor para interpretar JSON
app.use(bodyParser.json());

// Endpoint que recebe os dados do formulário
app.post('/cadastrar', async (req, res) => {
    const { fileName, content } = req.body;

    const repo = "TI-Inova/cadastro_user";
    const branch = "main";
    const token = process.env.GITHUB_TOKEN;
    const path = `/${fileName}`;
    const fileContentBase64 = Buffer.from(content).toString('base64');

    try {
        const response = await fetch(`https://api.github.com/repos/${repo}/contents${path}`, {
            method: "PUT",
            headers: {
                "Authorization": `token ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: "Novo arquivo de cadastro",
                content: fileContentBase64,
                branch: branch
            })
        });

        if (response.ok) {
            return res.status(200).send({ message: "Dados enviados e arquivo criado no GitHub com sucesso!" });
        } else {
            return res.status(500).send({ message: "Erro ao enviar dados para o GitHub." });
        }
    } catch (error) {
        console.error("Erro ao enviar os dados para o GitHub:", error);
        return res.status(500).send({ message: "Erro no backend." });
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
