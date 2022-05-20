module.exports = (req, res, next) => {
    if(!req.session.adminLoggedIn) {
        return res.redirect('/admin/login');
    }
    next();
}