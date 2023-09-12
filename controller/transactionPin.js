const TransactionPin = require("../model/TransactionPin");

const newPin = async (req, res) => {
  const user = req.user;
  const errorMg = req.flash("error").join(" ");
  const infoMg = req.flash("info").join(" ");
  const messages = {
    error: errorMg,
    info: infoMg,
  };
  if (req.method === "GET") {
    res.status(200).render("pages/new-pin", { messages });
  } else {
    const { pin, confirm_pin } = req.body;
    if (!pin || !confirm_pin) {
      req.flash("info", "all fields are required");
      return res.redirect("/new-pin");
    }
    if (pin !== confirm_pin) {
      req.flash("info", "please confirm your inputs");
      return res.redirect("/new-pin");
    }
    if (pin.length > 6 || pin.length < 4) {
      req.flash("info", "transaction pin should be 4 to 6 characters");
      return res.redirect("/new-pin");
    }
    const existingPin = await TransactionPin.findOne({ user: user._id });
    if (existingPin) {
      req.flash(
        "info",
        "user already has pin. Goto to settings page to update your pin"
      );
      return res.redirect("/new-pin");
    }
    await TransactionPin.create({ user: user._id, pin: pin });
    const redirectUrl = req.session.requestedUrl || "/dashboard";
    req.flash("info", "user pin created successfully");
    return res.redirect(redirectUrl);
  }
};

const updatePin = async () => {};

module.exports = {
  newPin,
  updatePin,
};
