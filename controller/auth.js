const User = require('../model/User.db')

const logInPage = async (req, res) => {
    res.status(200).render("pages/signin")
}

const signUpPage = async (req, res) => {
    res.status(200).render("pages/signup")
}

const login = async (req, res) => {
    res.redirect('/dashboard')
}

const signout = (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
}

const newUser = async (req, res, next) => {
    const {
        name,
        email,
        phoneNumber,
        password,
        confirmPassword
    } = req.body
    try {
        if (password !== confirmPassword) {
           return  res.status(400).redirect('/sign-up')
        }
        const user = new User({
            name, email, phoneNumber, password
        })
        User.register(user, password, function (err) {
            if (err) {
                console.log('error:', err);
                return next(err);
            }
            res.redirect('/dashboard')
        })
        
    } catch (error) {
        res.status(400).redirect('/sign-up')
    }
}

module.exports = {
    logInPage,
    login,
    logout:signout,
    newUser,
    signUpPage,
}