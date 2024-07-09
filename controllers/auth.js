const express = require("express");
const register = require("./register");
const registerE = require("./registerE")
const login = require("./login");
const logout = require("./logout");
const loginE = require("./loginE");
const router = express.Router();

router.post("/loginE", loginE)
router.post("/register", register);
router.post("/registerE", registerE)
router.post("/login", login);
router.post("/logout", logout)


module.exports = router;