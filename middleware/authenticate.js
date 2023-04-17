function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('info', 'your session has expired pls log in')
    res.redirect('/login');
}


module.exports = {
    isLoggedIn
}