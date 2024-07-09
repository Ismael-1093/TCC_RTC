const jwt = require("jsonwebtoken");
const db = require("../routes/db-config");

const loggedinE = (req, res, next) => {
    if (!req.cookies.CompanyRegistered) {
        return next(); 
    }

    try {
        const token = req.cookies.CompanyRegistered;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { cnpj } = decoded; 

        db.query('SELECT * FROM Empresas WHERE cd_cnpj = ?', [cnpj], (err, result) => {
            if (err) {
                console.error("Erro ao consultar banco de dados:", err);
                return next(err); 
            }

            if (!result.length) {
                console.error("Empresa não encontrada com o CNPJ:", cnpj);
                return next(); 
            }

            req.company = result[0]; 
            return next(); 
        });
    } catch (err) {
        console.error("Erro ao decodificar JWT:", err);
        return next(err); 
    }
}

module.exports = loggedinE;
