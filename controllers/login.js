const jwt = require("jsonwebtoken");
const db = require("../routes/db-config");

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ status: "error", error: "Por favor, insira seu email e senha" });
    } else {
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
            if (err) {
                console.error("Erro ao buscar usuário:", err);
                return res.status(500).json({ status: "error", error: "Erro no servidor" });
            }

            if (!result.length || password !== result[0].password) {
                return res.json({ status: "error", error: "Informações Incorretas" });
            } else {
                const token = jwt.sign({ id: result[0].id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES
                });

                const cookieOptions = {
                    expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                    httpOnly: true
                };

                res.cookie("userRegistered", token, cookieOptions);
                return res.json({ status: "success", success: "Usuário logado com sucesso" });
            }
        });
    }
};

module.exports = login;
  