const express = require("express");
const loggedIn = require("../controllers/loggedin");
const logout = require("../controllers/logout");
const loginE = require("../controllers/loginE");
const loggedinE = require("../controllers/loggedinE");
const registerEmpresa = require("../controllers/registerE");
const db = require("../routes/db-config");
const router = express.Router();


// Função para obter empresas do banco de dados
async function getCompaniesFromDatabase() {
    try {
        const query = `
            SELECT Empresas.cd_cnpj, Empresas.nm_empresa, AVG(Avaliacoes.avaliacao) AS media_avaliacao
            FROM Avaliacoes
            JOIN Empresas ON Avaliacoes.cd_cnpj = Empresas.cd_cnpj
            GROUP BY Empresas.cd_cnpj, Empresas.nm_empresa
            ORDER BY media_avaliacao DESC
            LIMIT 10
        `;
        const [results] = await db.promise().query(query);
        return results;
    } catch (err) {
        console.error('Erro na consulta SQL:', err);
        throw err;
    }
}

// Rota para a página inicial
router.get('/index.ejs', loggedIn, loggedinE, async (req, res) => {
    try {
        let companies = await getCompaniesFromDatabase();
        let status = '';
        let user = null;
        let company = null;

        if (req.user) {
            status = 'loggedIn';
            user = req.user;
        } else if (req.company) {
            status = 'loggedinE';
            company = req.company;
        } else {
            status = 'no';
        }

        res.render('index.ejs', { companies, status, user, company });
    } catch (err) {
        console.error('Erro ao obter empresas do banco de dados:', err);
        res.status(500).send('Erro ao obter empresas do banco de dados');
    }
});


// Rota para exibir informações da empresa e permitir avaliação
router.get('/company/:cd_cnpj', loggedIn, async (req, res) => {
    const cd_cnpj = req.params.cd_cnpj;
    try {
        const queryCompany = 'SELECT * FROM Empresas WHERE cd_cnpj = ?';
        const sqlReviews = `
        SELECT Avaliacoes.*, Users.nm_users
        FROM Avaliacoes
        INNER JOIN users ON Avaliacoes.id = users.id
        WHERE Avaliacoes.cd_cnpj = ?`;

        
        const [companyResult] = await db.promise().query(queryCompany, [cd_cnpj]);
        const [reviewsResult] = await db.promise().query(sqlReviews, [cd_cnpj]);
        
        if (companyResult.length > 0) {
            res.render('CompanyScreen.ejs', {
                company: companyResult[0],
                reviews: reviewsResult,
                user: req.user // Passa o usuário para a página CompanyScreen
            });
        } else {
            res.status(404).send('Empresa não encontrada');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro no servidor');
    }
});



router.post('/avaliar', loggedIn, async (req, res) => {
    const { cnpj, avaliacao, comentario } = req.body;
    const userId = req.user.id; // Obtém o ID do usuário autenticado

    const sqlInsert = 'INSERT INTO Avaliacoes (cd_cnpj, avaliacao, ds_comentario, id) VALUES (?, ?, ?, ?)';

    try {
        await db.promise().query(sqlInsert, [cnpj, avaliacao, comentario, userId]);
        res.redirect(`/company/${cnpj}`); // Redireciona para a página da empresa após inserção
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao salvar a avaliação');
    }
});

router.get("/Profile", loggedIn, async (req, res) => {
    try {
        const userId = req.user.id; // Obtém o ID do usuário autenticado

        const query = 'SELECT * FROM users WHERE id = ?';
        db.query(query, [userId], (err, result) => {
            if (err) {
                console.error('Erro ao consultar o banco de dados:', err);
                res.status(500).send('Erro ao consultar o banco de dados');
                return;
            }

            if (result.length === 0) {
                res.status(404).send('Usuário não encontrado');
                return;
            }

            const user = result[0]; // Assume que há apenas um usuário com esse ID

            res.render('Profile', { user });
        });
    } catch (err) {
        console.error('Erro ao obter informações do perfil:', err);
        res.status(500).send('Erro ao obter informações do perfil');
    }
});

// Rota para atualizar informações do perfil do usuário
router.post('/Profile/editar', async (req, res) => {
    const { id, nome, senha } = req.body;

    try {
        const query = 'UPDATE users SET nm_users = ?, password = ? WHERE id = ?'; // Substitua pela sua query

        db.query(query, [nome, senha, id], (err, result) => {
            if (err) {
                console.error('Erro ao atualizar informações no banco de dados:', err);
                res.status(500).send('Erro ao atualizar informações no banco de dados');
                return;
            }

            console.log('Informações do perfil atualizadas com sucesso');
            res.redirect('/Profile'); // Redireciona de volta para a página de perfil após a atualização
        });
    } catch (err) {
        console.error('Erro ao atualizar informações do perfil:', err);
        res.status(500).send('Erro ao atualizar informações do perfil');
    }
});


async function getCompanyFromDatabase(companyId) {
    try {
        const query = 'SELECT * FROM Empresas WHERE cd_cnpj = ?';
        const [result] = await db.promise().query(query, [companyId]);
        return result[0]; // Retorna a primeira empresa encontrada com o CNPJ fornecido
    } catch (err) {
        console.error('Erro ao consultar o banco de dados:', err);
        throw err;
    }
}

// Rota para exibir o perfil da empresa e permitir edição
router.get("/ProfileE", loggedinE, async (req, res) => {
    try {
        const companyId = req.company.cd_cnpj; // Obtém o CNPJ da empresa autenticada
        const company = await getCompanyFromDatabase(companyId);

        if (!company) {
            res.status(404).send('Empresa não encontrada');
            return;
        }

        res.render("ProfileE", { company });
    } catch (err) {
        console.error('Erro ao obter informações do perfil da empresa:', err);
        res.status(500).send('Erro ao obter informações do perfil da empresa');
    }
});

// Rota para atualizar informações do perfil da empresa
router.post('/ProfileE/editar', loggedinE, async (req, res) => {
    const { cd_cnpj, nome, telefone, ds_site, cep } = req.body;

    try {
        const query = 'UPDATE Empresas SET nm_empresa = ?, telefone = ?, ds_site = ?, CEP = ? WHERE cd_cnpj = ?';

        await db.promise().query(query, [nome, telefone, ds_site, cep, cd_cnpj]);
        console.log('Informações do perfil da empresa atualizadas com sucesso');
        res.redirect('/ProfileE'); // Redireciona de volta para a página de perfil da empresa após a atualização
    } catch (err) {
        console.error('Erro ao atualizar informações do perfil da empresa:', err);
        res.status(500).send('Erro ao atualizar informações do perfil da empresa');
    }
});


// Rota para exibir o formulário de registro
router.get("/register", (req, res) => {
    res.sendFile("register.html", { root: "./public/" });
});

router.get("/registerE", (req, res) => {
    res.sendFile("registerE.html", { root: "./public/" });
});

// Rota para exibir o formulário de login
router.get("/login", (req, res) => {
    res.sendFile("login.html", { root: "./public/" });
});

router.get("/LoginE", (req, res) => {
    res.sendFile("loginE.html", { root: "./public/" });
});

router.get("/Profile", (req, res) => {
    res.render("Profile.ejs", { root: "./views/" });
});

// Rota para registro de empresa via API
router.post("/api/registerEmpresa", registerEmpresa);

// Rota para logout
router.get("/logout", logout);

module.exports = router;
