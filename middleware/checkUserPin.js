const { CustomAPIError } = require("../handleError");
const TransactionPin = require("../model/TransactionPin");

const verifyUserPin = async (req, res, next) => {
  const { pin } = req.body;
  if (!pin) {
    throw new CustomAPIError("please provide transaction pin", 400);
  }
  const userPin = await TransactionPin.findOne({ user: req.user._id });
  if (!userPin) {
    throw new CustomAPIError("user has no transaction pin", 422);
  }
  const isPinValid = await userPin.comparePin(pin);
  if (!isPinValid) {
    throw new CustomAPIError("incorrect transaction pin", 400);
  }
  next();
};

const checkUserPin = async (req, res, next) => {
  const userPin = await TransactionPin.findOne({ user: req.user._id });
  req.session.requestedUrl = req.originalUrl;
  if (!userPin) {
    req.flash("info", "set your transaction pin to continue");
    return res.redirect("/new/pin");
  }
  next();
};

module.exports = {
  verifyUserPin,
  checkUserPin,
};
