const formatPlan = (item, admin = false) => {
  const plan = { ...item.toObject() };
  if (!admin) {
    delete plan.cost;
  }
  return {
    ...plan,
  };
};

module.exports = {
  formatPlan,
};
