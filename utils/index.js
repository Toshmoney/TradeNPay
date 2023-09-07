require("dotenv").config();
const axios = require("axios");

const { randomChars, generateTransId } = require("./randomChars");
const businessBalance = require("./businessBalance");
const { transactionQuery } = require("./transactionQuery");
const { dashboardData, formatTransaction } = require("./dashboardData");
const { formatPlan } = require("./dataPlan");
const { formatDate, data_provider } = require("./lib");
const getStatus = async (service_id = "BCA", requestType = "SME") => {
  try {
    const response = await axios.post(
      "https://enterprise.mobilenig.com/api/services/proxy",
      {
        service_id: service_id,
        requestType: requestType,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_PUBLIC_KEY}`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const fetchPrices = async (service_id = "BCA", requestType = "SME") => {
  try {
    const response = await axios.post(
      "https://enterprise.mobilenig.com/api/services/packages",
      {
        service_id: service_id,
        requestType: requestType,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_PUBLIC_KEY}`,
        },
      }
    );
    let details = await response.data.details;
    details = details.map((detail) => {
      return {
        ...detail,
        cost: Math.ceil(detail.cost),
      };
    });
    details = details.filter((detail) => detail.status === "1");
    return details;
  } catch (error) {
    return [];
  }
};

module.exports = {
  getStatus,
  fetchPrices,
  randomChars,
  generateTransId,
  businessBalance,
  transactionQuery,
  dashboardData,
  formatTransaction,
  formatPlan,
  formatDate,
  data_provider,
};
