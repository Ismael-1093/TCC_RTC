const jwt = require("jsonwebtoken");
const db = require("../routes/db-config");

const loginE = async (req, res) => {
    const { cnpj, password } = req.body;

    if (!cnpj || !password) {
        return res.json({ status: "error", error: "Por favor, insira seu CNPJ e senha" });
    }

    try {
        db.query('SELECT * FROM Empresas WHERE cd_cnpj = ?', [cnpj], async (err, result) => {
            if (err) {
                console.error("Erro ao consultar banco de dados:", err);
                return res.json({ status: "error", error: "Erro ao consultar banco de dados" });
            }

            if (!result.length || result[0].password !== password) {
                return res.json({ status: "error", error: "CNPJ ou senha incorretos" });
            }

            const token = jwt.sign({ cnpj: result[0].cd_cnpj }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES
            });

            const cookieOptions = {
                expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                httpOnly: true
            };

            res.cookie("CompanyRegistered", token, cookieOptions);
            return res.json({ status: "success", success: "Empresa logada com sucesso" });
        });
    } catch (err) {
        console.error("Erro durante o login:", err);
        return res.json({ status: "error", error: "Erro durante o login" });
    }
}

module.exports = loginE;
