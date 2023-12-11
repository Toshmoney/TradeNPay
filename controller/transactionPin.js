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
      return res.redirect("/new/pin");
    }
    if (pin !== confirm_pin) {
      req.flash("info", "please confirm your inputs");
      return res.redirect("/new/pin");
    }
    if (pin.length > 6 || pin.length < 4) {
      req.flash("info", "transaction pin should be 4 to 6 characters");
      return res.redirect("/new/pin");
    }
    const existingPin = await TransactionPin.findOne({ user: user._id });
    if (existingPin) {
      req.flash(
        "info",
        "user already has pin. Goto to settings page to update your pin"
      );
      return res.redirect("/new/pin");
    }
    await TransactionPin.create({ user: user._id, pin: pin });
    const redirectUrl = req.session.requestedUrl || "/dashboard";
    req.flash("info", "user pin created successfully");
    return res.redirect(redirectUrl);
  }
};

const updatePin = async (req, res) => {
  const user = req.user;
  const errorMg = req.flash("error").join(" ");
  const infoMg = req.flash("info").join(" ");
  const messages = {
    error: errorMg,
    info: infoMg,
  };
  if (req.method === "GET") {
    res.status(200).render("pages/update-pin", { messages });
  } else {
    const { new_pin, old_pin } = req.body;
    if (!new_pin || !old_pin) {
      req.flash("info", "all fields are required");
      return res.redirect("/update/pin");
    }
    const existingPin = await TransactionPin.findOne({ user: user._id });
    if (!existingPin) {
      req.flash(
        "info",
        "user has no pin. Goto to settings page to set your pin"
      );
      return res.redirect("/update/pin");
    }
    if (new_pin.length > 6 || new_pin.length < 4) {
      req.flash("info", "transaction pin should be 4 to 6 characters");
      return res.redirect("/update/pin");
    }
    const confirmOldPin = await existingPin.comparePin(old_pin);
    if (!confirmOldPin) {
      req.flash("info", "incorrect old pin");
      return res.redirect("/update/pin");
    }
    existingPin.pin = new_pin;
    await existingPin.save();
    const redirectUrl = req.session.requestedUrl || "/dashboard";
    req.flash("info", "user pin changed successfully");
    return res.redirect(redirectUrl);
  }
};

module.exports = {
  newPin,
  updatePin,
};
