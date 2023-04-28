const User = require('../model/User.db')
const Wallet = require("../model/Wallet")

const logInPage = async (req, res) => {
    const errorMg = req.flash('error').join(' ')
    const infoMg = req.flash('info').join(' ')
    const messages = {
        error: errorMg,
        info: infoMg
    }
    res.status(200).render("pages/signin", { messages })
}

const signUpPage = async (req, res) => {
    const errorMg = req.flash('error').join(' ')
    const infoMg = req.flash('info').join(' ')
    const messages = {
        error: errorMg,
        info: infoMg
    }
    res.status(200).render("pages/signup", { messages })
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
        // check if passwords match
        if (password !== confirmPassword) {
            req.flash('error', 'passwords do not match')
            return  res.redirect('/sign-up')
        }
        const user = new User({
            name, email, phoneNumber, password
        })
        // check if user exist
        const existingUser = await User.findOne({email: email})
        if (existingUser) {
            req.flash('error', 'email already taken')
            return  res.redirect('/sign-up')
        }
        User.register(user, password, function (err) {
            if (err) {
                console.log('error:', err);
                return next(err);
            }
            const userWallet = new Wallet({
                user: user._id
            })
            userWallet.save()
            .then()
            .catch((error) => {
                next(error)
            })
            res.redirect('/dashboard')
        })
        
    } catch (error) {
        res.redirect('/sign-up')
    }
}

module.exports = {
    logInPage,
    logout:signout,
    newUser,
    signUpPage,
}