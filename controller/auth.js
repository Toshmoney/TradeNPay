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

const forgotPassword = async (req, res)=>{
    const errorMg = req.flash('error').join(' ')
    const infoMg = req.flash('info').join(' ')
    const messages = {
        error: errorMg,
        info: infoMg
    }
    res.status(200).render("pages/forgotPassword",{messages})
}
const confirmPass = async (req, res)=>{
    res.status(200).render("pages/confirmation")
}

const confirmReset = async (req, res, next)=>{
    const email = req.body.email;

    // check if user enter email
    if (!email) {
        req.flash('error', 'You have not entered any email!')
        return  res.redirect('/forgot-password')
    }

    // check if email exist
    const existingEmail = await User.findOne({email: email})
    if (!existingEmail) {
        req.flash('error', 'There is no user with this email')
        return  res.redirect('/forgot-password')
    }
    res.redirect("/confirmation")
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
    forgotPassword,
    confirmReset,
    confirmPass
}