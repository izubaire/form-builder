module.exports = (req, res, next) => {
    if(!req.session.clientLoggedIn) {
        return res.redirect('/client/login');
    }
    next();
}