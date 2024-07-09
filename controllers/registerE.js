const db = require("../routes/db-config");
const bcrypt = require("bcryptjs");

const registerEmpresa = async (req, res) => {
    const { cd_cnpj, nm_empresa, email, password, telefone, dt_fundacao, ds_site, CEP } = req.body;

    if (!cd_cnpj || !nm_empresa || !email || !password || !telefone || !dt_fundacao || !ds_site || !CEP) {
        return res.status(400).json({ status: 'error', error: 'Todos os campos são obrigatórios.' });
    }


    db.query('SELECT * FROM Empresas WHERE cd_cnpj = ? OR email = ?', [cd_cnpj, email], async (err, results) => {
        if (err) {
            console.error('Erro ao verificar CNPJ/email:', err);
            return res.status(500).json({ status: 'error', error: 'Erro ao verificar CNPJ/email.' });
        }

        if (results.length > 0) {
            // Verifica se o CNPJ ou email já estão cadastrados
            if (results[0].cd_cnpj === cd_cnpj) {
                return res.status(400).json({ status: 'error', error: 'CNPJ já cadastrado.' });
            } else if (results[0].email === email) {
                return res.status(400).json({ status: 'error', error: 'E-mail já em uso.' });
            }
        } else {

            

            // Insere a empresa no banco de dados
            db.query('INSERT INTO Empresas SET ?', {
                cd_cnpj: cd_cnpj,
                nm_empresa: nm_empresa,
                email: email,
                password: password,
                telefone: telefone,
                dt_fundacao: dt_fundacao,
                ds_site: ds_site,
                CEP: CEP
            }, (error, success) => {
                if (error) {
                    console.error('Erro ao cadastrar empresa:', error);
                    return res.status(500).json({ status: 'error', error: 'Erro ao cadastrar empresa.' });
                }
                console.log('Empresa cadastrada com sucesso:', success);
                return res.status(201).json({ status: 'success', success: 'Empresa cadastrada com sucesso.' });
            });
        }
    });
};

module.exports = registerEmpresa;
