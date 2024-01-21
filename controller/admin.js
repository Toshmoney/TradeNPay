const DataPlan = require("../model/DataPlan");
const slugify = require('slugify');
const User = require("../model/User.db");
const { dashboardData } = require("../utils/dashboardData");
const { formatDate, data_provider, trade_type } = require("../utils");
const { subvtu_balance } = require("../utils/subvtu");
const Transaction = require("../model/Transaction");
const Wallet = require("../model/Wallet");
const Trades = require("../model/Trades");
const Posts = require("../model/Post");
const TradePlan = require("../model/TradePlan");
const nodemailer = require("nodemailer");
require("dotenv").config();

const base_url = process.env.BASE_URL

const adminDashboard = async (req, res) => {
  const errorMg = req.flash("error").join(" ");
  const infoMg = req.flash("info").join(" ");
  const messages = {
    error: errorMg,
    info: infoMg,
  };
  const subvtu_bal = await subvtu_balance();
  const business_bal = subvtu_bal?.user?.Account_Balance;
  const targetDate = new Date();
  const startDate = new Date(targetDate);
  startDate.setHours(0, 0, 0, 0);
  const todayTransactions = await Transaction.find({
    createdAt: { $gte: startDate, $lte: targetDate },
    status: "completed",
  });
  const daily = todayTransactions.length;
  const purchase = todayTransactions
    .filter((item) => item.type === "debit")
    .reduce((sum, current) => sum + current.amount, 0);
  const data = await dashboardData(req.user, true);
  const totalUser = await User.countDocuments();
  res.status(200).render("admin/dashboard", {
    ...data,
    total_user: totalUser,
    daily,
    purchase,
    messages,
    business_balance: business_bal,
  });
};

const adminTrans = async (req, res) => {
  const errorMg = req.flash("error").join(" ");
  const infoMg = req.flash("info").join(" ");
  const messages = {
    error: errorMg,
    info: infoMg,
  };

  let transactions = await Transaction.find()
    .sort("-createdAt")
    .populate("user", "name email _id");
  transactions = transactions.map((item) => {
    const transaction = item.toObject();
    return {
      ...transaction,
      createdAt: formatDate(transaction.createdAt),
      updatedAt: formatDate(transaction.updatedAt),
    };
  });
  res.status(200).render("admin/transactions", { transactions, messages });
};

const allUsers = async (req, res) => {
  let wallets = await Wallet.find().populate("user");
  wallets = wallets.map((item) => {
    const wallet = item.toObject();
    return {
      user_id: wallet.user?._id,
      name: wallet.user?.name,
      email: wallet.user?.email,
      createdAt: formatDate(wallet.user?.createdAt),
      previous_balance: wallet?.previous_balance,
      current_balance: wallet?.current_balance,
    };
  });
  
  res.status(200).render("admin/allusers", { users: wallets });
};

const adminSettings = async (req, res) => {
  const data = await dashboardData(req.user);
  res.status(200).render("admin/adminsettings", data);
};

const adminManualFunding = async (req, res) => {
  const data = await dashboardData(req.user);
  const errorMg = req.flash("error").join(" ");
  const infoMg = req.flash("info").join(" ");
  const messages = {
    error: errorMg,
    info: infoMg,
  };

  const {user} = data

  res.status(200).render("admin/manualfunding", {user, msg : messages});
};

const makeUserAdmin = async (req, res) => {
  const data = await dashboardData(req.user);
  const errorMg = req.flash("error").join(" ");
  const infoMg = req.flash("info").join(" ");
  const messages = {
    error: errorMg,
    info: infoMg,
  };

  const {user} = data

  res.status(200).render("admin/makeadmin", {user, msg : messages});
};

const revertAdminRole = async (req, res) => {
  const data = await dashboardData(req.user);
  const errorMg = req.flash("error").join(" ");
  const infoMg = req.flash("info").join(" ");
  const messages = {
    error: errorMg,
    info: infoMg,
  };

  const {user} = data

  res.status(200).render("admin/revertuser", {user, msg : messages});
};

const adminDataPlans = async (req, res) => {
  const data_plans = await DataPlan.find().sort("-network_name");
  res.status(200).render("admin/dataplans", { data_plans });
};

const adminDataReset = async (req, res) => {
  const { plan_id } = req.params;
  const data_plan = await DataPlan.findOne({ plan_id: plan_id });
  res.status(200).render("resets/data", {
    data_plan: data_plan || {},
    networks: data_provider,
  });
};

const baseurl = process.env.BASE_URL;
const adminTradePlans = async (req, res) => {
  const trade = await fetch(`${baseurl}/api/v1/trade_plan`).then(res => res.json())
  const tradePrice = trade?.data;
  const user = req.user;

  const errorMg = req.flash("error").join(" ");
  const infoMg = req.flash("info").join(" ");
  const messages = {
    error: errorMg,
    info: infoMg,
  };

  res.status(200).render("admin/tradeplans", {msg : messages, user, tradePrice});
};

const adminTradeReset = async (req, res) => {
  const { service_id } = req.params;
  const trade_plan = await TradePlan.findOne({ service_id: service_id });
  res.status(200).render("resets/data", {
    trade_plan: trade_plan || {},
    trade_type: trade_type,
  });
};

const adminCableReset = async (req, res) => {
  const data = await dashboardData(req.user);
  res.status(200).render("resets/tv", data);
};

const adminExamReset = async (req, res) => {
  const data = await dashboardData(req.user);
  res.status(200).render("resets/exam", data);
};

const adminElectricityReset = async (req, res) => {
  const data = await dashboardData(req.user);
  res.status(200).render("resets/electricity", data);
};

const allTrades = async(req, res)=>{
  let trades = await Transaction.find()

  if(!trades){
    res.json({message: "No trade done yet"})
  }

  trades = trades.map((item) => {
    const trades = item.toObject();
    return {
      trade_id: trades._id,
      name: trades.user.name,
      amount:trades.amount,
      currency:trades.currency,
      service_id:trades.service_id,
      trade_type:trades.trade_type,
      trans_id:trades.trans_id,
      proof:trades.proof,
      createdAt: formatDate(trades.createdAt),
      updatedAt: formatDate(trades.updatedAt),
    };
  });
  res.json(trades)
}

// Accept user trades
const approveTrades = async(req, res)=>{
  const _id = req.params['id']
  const userTrade = await Transaction.findOne({_id});
  let user = userTrade.user;
  let balance_before = userTrade.balance_before;
  let balance_after = userTrade.balance_after;
  let amount = userTrade.amount;
  let id = userTrade._id
  let userWallet = await Wallet.findOne({user});

  const userBalance = userWallet.current_balance;

  if(!userTrade) throw new Error('No trade with that id')

  if(userTrade.status === 'completed'){
    req.flash("error", "Trade already approved!")
    return;
  }

  userTrade.status = "completed"

  const person = await User.findById({_id:user});
  const email = person.email;
  const name = person.name;

  // Use Nodemailer to send notification email to the user
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "New Trade Approval Notification!",
    text: `Dear ${name}, your new trade has been approved and NGN${amount} has been added to your wallet!`,
  };

  transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.log(err);
        req.flash("error", "Error while sending Notification to user");
        return res.redirect("/admin");
      }
    });
  
  
    // add transaction amount to user wallet
    userWallet.previous_balance = userBalance;
    userWallet.current_balance = userBalance + amount;
    await userWallet.save();
    await userTrade.save();

  req.flash("info", "Successfully Approved trade, user will now get credited!")
  return res.redirect("/transactions/all")
}


// Reject User Trades

const rejectTrades = async(req, res)=>{
  const _id = req.params['id']
  const userTrade = await Transaction.findOne({_id});
  let user = userTrade.user;
  let balance_before = userTrade.balance_before;
  let balance_after = userTrade.balance_after;
  let amount = userTrade.amount;
  let id = userTrade._id
  let userWallet = await Wallet.findOne({user});

  const userBalance = userWallet.current_balance;

  if(!userTrade) throw new Error('No trade with that id')

  if(userTrade.status === 'completed'){
    req.flash("error", "Trade already approved!")
    return;
  }

  if(userTrade.status === 'rejected'){
    req.flash("error", "Trade already rejected by admin!")
    return;
  }

  userTrade.status = "rejected"
  userTrade.description = `NGN ${amount} worth of trade funds rejected!`

  const person = await User.findById({_id:user});
  const email = person.email;
  const name = person.name;

  // Use Nodemailer to send notification email to the user
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "Trade Notification from paytoNaira!",
    text: `Dear ${name}, sorry your new trade of N${amount} was rejected due to invalid documents submitted, kindly contact admin to learn more!`,
  };

  transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.log(err);
        req.flash("error", "Error while sending Notification to user");
        return res.redirect("/admin");
      }
    });
  
  
    // add transaction amount to user wallet
    userWallet.previous_balance = userBalance;
    userWallet.current_balance = userBalance;
    await userWallet.save();
    await userTrade.save();

  req.flash("info", "Successfully rejected trade, user will be notified shortly!")
  return res.redirect("/transactions/all")
}

// Make User an Admin
const assignAdminRole = async(req, res)=>{
  const {email} = req.body
  const user = await User.findOne({email: email.toLowerCase()});
  if(!user){
    req.flash("error", "No user found!")
    return res.redirect("/role/make-admin");
  }

  if(user.is_admin === true){
    req.flash("error", "User is already an admin!")
    return res.redirect("/role/make-admin");
  }

  user.is_admin = true;

  const name = user.name;

  // Use Nodemailer to send notification email to the user
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "User Role Updated!",
    text: `Dear ${name}, you have been given admin role, login to admin dashboard to continue!`,
  };

  transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.log(err);
        req.flash("error", "Error while sending Notification to user");
        return res.redirect("/admin");
      }
    });
  
  
    // add transaction amount to user wallet
    await user.save();

  req.flash("info", "Successfully assigned new role to user!")
  return res.redirect("/role/make-admin")
}

// Revert Admin to normal user
const turnAdminToUser = async(req, res)=>{
  const {email} = req.body
  const user = await User.findOne({email: email.toLowerCase()});
  if(!user){
    req.flash("error", "No user found!")
    return res.redirect("/role/make-admin");
  }

  if(user.is_admin === false){
    req.flash("error", "User is not admin before!")
    return res.redirect("/role/turn-to-user");
  }

  user.is_admin = false;

  const name = user.name;

  // Use Nodemailer to send notification email to the user
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "User Role Updated!",
    text: `Dear ${name}, your role has been reverted to normal user!`,
  };

  transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.log(err);
        req.flash("error", "Error while sending Notification to user");
        return res.redirect("/admin");
      }
    });
  
  
    // add transaction amount to user wallet
    await user.save();

  req.flash("info", "Successfully reverted the admin to normal user!")
  return res.redirect("/role/make-admin")
}

// Create new blog post
const createPost = async(req, res)=>{

  const user = req.user;

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      req.flash("error", "Post image is missing!");
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./public/') + '/post/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err){
          req.flash("error", err);
        }
      })

    }

    const {title, summary, content} = req.body;
    const slug = slugify(title, { lower: true, replacement: '-' });
    try {
        const createdPost = await Posts.create({
            title,
            content,
            cover_img : newImageName,
            summary,
            author : "admin",
            slug
        });
        if(!createdPost) throw new Error("There was an error creating new blog post")
        res.json(createdPost)

        } catch (error) {
           res.json(error) 
        }

}

const getSinglePost = async(req, res)=>{
  const slug = req.params['slug']
  try {
  let foundPost = await Posts.findOne({slug})
  if(!foundPost){
      res.status(404).json({message: "Post doesn't not exist or has been removed!"})
  }

  const customimg = `${base_url}/post`

  foundPost = {
    _id: foundPost._id,
    title: foundPost.title,
    summary:foundPost.summary,
    content:foundPost.content,
    cover_img:`${customimg}/${foundPost.cover_img}`,
    author:foundPost.author,
    createdAt: formatDate(foundPost.createdAt),
    updatedAt: formatDate(foundPost.updatedAt),
  };

  res.status(200).json(foundPost)

  } catch (error) {
      console.log(error);
  }
};

// ============== Get All Posts ================

const getAllPost = async(req, res)=>{
  try {
  const foundPost = await Posts.find()
  .sort({createdAt: -1})
  .limit(20)
  
  if(foundPost.length === 0){
    res.json({message : "No blog post published yet!"})
  }

  res.status(200).json(foundPost)
  } catch (error) {
      console.log(error);
  }
};

// ============== Edit Single Post ================

const editSinglePost = async(req, res)=>{
  let newImageName = null
  let uploadPath;
  let imageUploadFile;
  if(req.file){
  
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err){
          req.flash("error", err);
        }
      })
  }
  const {content, title, summary} = req.body;
  const slug = req.params['slug']
  const postDoc = await Posts.findOneAndUpdate({slug},{
      title,
      content,
      summary,
      slug,
      cover_img: newImageName ? newImageName : postDoc.cover_img
  },{new:true, runValidators:true}
  
  )
  
  }

  const deletePost = async(req, res)=>{
    const slug = req.params['slug']
    const deletedPost = await Posts.findOneAndDelete({slug})
    if(!deletedPost) throw new Error('Blog does not exist!')

    res.json({message: "Blog post deleted successfully!"})
  }

  const deleteAllPost = async(req, res)=>{
    const deletedPosts = await Posts.deleteMany();
    if(!deletedPosts)throw new Error("Blog post is currently empty!");
    res.json({message: "All posts deleted successfully!"})
  }

module.exports = {
  adminDashboard,
  adminTrans,
  allUsers,
  adminSettings,
  adminDataPlans,
  adminDataReset,
  adminCableReset,
  adminExamReset,
  adminElectricityReset,
  allTrades,
  approveTrades,
  createPost,
  getSinglePost,
  getAllPost,
  editSinglePost,
  deletePost,
  deleteAllPost,
  adminTradeReset,
  adminTradePlans,
  adminManualFunding,
  rejectTrades,
  makeUserAdmin,
  assignAdminRole,
  turnAdminToUser,
  revertAdminRole
};
