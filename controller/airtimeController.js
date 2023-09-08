require("dotenv").config();
const { generateTransId } = require("../utils");
const Transaction = require("../model/Transaction");
const { CustomAPIError } = require("../handleError");
const { subvtu_recharge } = require("../utils/subvtu");
const PURCHASE_ENDPOINT = process.env.AIRTIME_PURCHASE_ENDPOINT;

const buyAirtime = async (req, res) => {
  const { amount, phoneNumber, network_id } = req.body;
  const user = req.user;
  const userWallet = req.user.wallet;
  const initialBalance = userWallet.current_balance;

  // create a unique transaction_id
  let transaction_id;
  while (true) {
    transaction_id = generateTransId();
    const existingTrans = await Transaction.findOne({
      reference_number: transaction_id,
    });
    if (!existingTrans) {
      break;
    }
  }
  // create transaction with pending status
  const transaction = new Transaction({
    user: user._id,
    amount: Number(amount),
    balance_before: initialBalance,
    balance_after: initialBalance,
    status: "pending",
    service: "airtime",
    type: "debit",
    description: `airtime purchase for ${phoneNumber}`,
    reference_number: transaction_id,
  });
  // form request data
  const req_data = {
    network: network_id,
    amount: Number(amount),
    mobile_number: phoneNumber,
    Ported_number: false,
    airtime_type: "VTU",
  };
  // send request to server
  const purchase_id = await subvtu_recharge(PURCHASE_ENDPOINT, req_data);
  if (!purchase_id) {
    transaction.status = "failed";
    await transaction.save();
    throw new CustomAPIError(
      "unable to process transaction, try again later",
      422
    );
  }
  // update transaction to be concluded
  const newBalance = initialBalance - Number(amount);
  transaction.status = "completed";
  transaction.external_id = purchase_id;
  transaction.balance_after = newBalance;
  // deduct transaction amount from user wallet
  userWallet.previous_balance = initialBalance;
  userWallet.current_balance = newBalance;
  await userWallet.save();
  await transaction.save();
  res.status(202).json({
    message: "your transaction is being processed",
    balance: newBalance,
    success: true,
  });
};

module.exports = {
  buyAirtime,
};
