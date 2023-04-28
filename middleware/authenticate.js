function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.requestedUrl = req.originalUrl
    const requestedUrl = req.originalUrl || '/dashboard'
    req.flash('info', 'your session has expired pls log in')
    res.redirect(`/login?redirect=${requestedUrl}`);
}

module.exports = {
    isLoggedIn
}