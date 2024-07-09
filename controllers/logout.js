const logout = (req, res) => {
    res.clearCookie("userRegistered");
    res.clearCookie("CompanyRegistered");
    res.redirect("/");
}

module.exports = logout;