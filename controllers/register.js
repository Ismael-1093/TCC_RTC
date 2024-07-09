const db = require ("../routes/db-config");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
    const { name, email, password: Npassword } = req.body
    if(!email || !Npassword)return res.json({status:"error", error:"Por favor, insira seu email e senha"});
    else{
        console.log(email);
        db.query('SELECT email FROM users WHERE email = ?', [email], async (err, result) => {
            if(err) throw err;
            if(result[0]) return res.json({status:"error", error:"Email já em uso"})
            else {
               const password = (Npassword);
               console.log(password);
               db.query('INSERT INTO users SET ?', {nm_users:name,email:email,password:password},(error, results) => {
                if(error) throw error;
                return res.json({status:"success", success: "Usuário Registrado!"})
               })
        }
        })
    }
}
module.exports = register