const User = require('../model/User.db')
const Wallet = require("../model/Wallet");
const crypto = require("crypto");
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer")

const logInPage = async (req, res) => {
    const errorMg = req.flash('error').join(' ')
    const infoMg = req.flash('info').join(' ')
    const messages = {
        error: errorMg,
        info: infoMg
    }
    res.status(200).render("pages/signin", { messages })
}

const generateResetToken = () => {
    const token = crypto.randomBytes(32).toString('hex');
    return token;
  };

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
    const {email} = req.body;

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

        const resetToken = generateResetToken();

            existingEmail.resetToken = resetToken;
            existingEmail.resetExpires = Date.now() + 3600000;
            await existingEmail.save();

            // Send an email with the reset link
            const resetLink = `http://localhost:4000/reset-password/${resetToken}`;

            // Use Nodemailer to send the reset email
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USERNAME,
                to: email,
                subject: 'Password Reset From Alphabills',
                text: `Click the following link to reset your password: ${resetLink} <br>Ignore if you didn't request for password reset`,
            };

            transporter.sendMail(mailOptions, (err)=>{
                if(err){
                    console.log(err);
                    req.flash('error', 'Error sending email.');
                    return res.redirect('/confirmation');
                }
            req.flash('success', `An email has been sent to  ${existingEmail.email} with further instructions.`);
            res.redirect("/confirmation")
            });
}

const getPasswordUpdatedPage = async(req, res)=>{
   
        const errorMg = req.flash('error').join(' ')
        const infoMg = req.flash('info').join(' ')
        const messages = {
            error: errorMg,
            info: infoMg
        }
        const user = await User.findOne({
            resetToken: req.params.token,
            resetExpires: { $gt: Date.now() },
        })
            if (!user) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('/confirmation');
            }
            res.render('pages/reset', { token: req.params.token, messages });
}

const updatePassword = async(req, res)=>{
    const user = await User.findOne({
        resetToken: req.params.token,
        resetExpires: { $gt: Date.now() },
    })
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/confirmation');
        }
        if (req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, (err) => {
                user.resetToken = undefined;
                user.resetExpires = undefined;

                user.save()
                req.flash('success', 'Password has been reset successfully.');
                res.redirect('/login'); 
            });
        } else {
            req.flash('error', 'Passwords do not match.');
        }

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
    confirmPass,
    getPasswordUpdatedPage,
    updatePassword
}