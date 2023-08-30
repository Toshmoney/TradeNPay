const notFoundMiddleWare = (req, res) => {
  return res.status(404).json({ message: "Page not found!" });
};

module.exports = notFoundMiddleWare;
