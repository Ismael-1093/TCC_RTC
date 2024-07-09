const express = require("express");
const cookieParser = require("cookie-parser");
const db = require("./routes/db-config"); // Verifique o caminho para o arquivo db-config
const app = express();
const PORT = process.env.PORT || 5000;

// Configurações do Express
app.set('view engine', 'ejs');
app.use("/js", express.static(__dirname + "/public/js"));
app.use("/css", express.static(__dirname + "/public/css"));
app.use("/css", express.static(__dirname + "/views/css"));
app.use("/images", express.static(__dirname + "/public/images"));
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Rotas existentes do seu servidor
app.get('/', (req, res) => {
    res.render('Choose.ejs');
});

app.use("/", require("./routes/pages"));
app.use("/api", require("./controllers/auth"));

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});             
