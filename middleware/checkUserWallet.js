const Wallet = require("../model/Wallet")

const verifyWallet = async (req, res, next) => {
    const user = req.user
    const { amount } = req.body
    let val = Number(amount)
    if (!user) {
        return res.status(401).json({
            message: 'user not recognised',
            error: 'authentication'
        })
    }
    const userWallet = await Wallet.findOne({user: user._id})
    if (!userWallet) {
        return res.status(400).json({
            message: 'No wallet for user',
            error: 'wallet'
        })
    }
    if (userWallet.balance < Number(val)) {
        return res.status(400).json({
            message: 'Insufficient wallet balance',
            error: 'balance'
        })
    }
    req.user.wallet = userWallet
    next()
}

module.exports = verifyWallet