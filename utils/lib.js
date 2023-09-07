const formatDate = (date_string) => {
  const trans_date = new Date(date_string);
  const year = trans_date.getFullYear();
  let month = trans_date.getMonth() + 1;
  let day = trans_date.getDate();
  if (month < 10) {
    month = `0${month}`;
  }
  if (day < 10) {
    day = `0${day}`;
  }
  return `${year}-${month}-${day}`;
};

const data_provider = [
  { name: "MTN", id: "1" },
  { name: "GLO", id: "2" },
  { name: "9MOBILE", id: "3" },
  { name: "AIRTEL", id: "4" },
];

module.exports = {
  formatDate,
  data_provider,
};
