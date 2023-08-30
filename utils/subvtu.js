const { default: axios } = require("axios");
const AUTH_TOKEN = `Token ${process.env.SUBVTU_SECRET}`;

const subvtu_recharge = async (url, body) => {
  try {
    const req = await axios.post(url, body, {
      headers: { Authorization: AUTH_TOKEN },
    });
    const { data } = req;
    const status = data?.Status || data?.status;
    if (status === "failed") {
      console.log("transaction failed");
      return false;
    }
    return data?.id;
  } catch (error) {
    console.log("purchase error");
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data || error.response || error.request);
    } else {
      console.log(error);
    }
    return false;
  }
};

const subvtu_validate_card = async ({ card_number, provider_name }) => {
  const url = new URL("https://subvtu.com/ajax/validate_iuc");
  url.searchParams.append("smart_card_number", card_number);
  url.searchParams.append("cablename", provider_name);
  try {
    const req = await axios.get(url.href, {
      headers: { Authorization: AUTH_TOKEN },
    });
    const invalid = req.data.invalid;
    if (invalid === true) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

const subvtu_validate_meter = async ({
  meter_number,
  provider_name,
  meter_type,
}) => {
  try {
    const url = new URL("https://subvtu.com/ajax/validate_meter_number");
    url.searchParams.append("meternumber", meter_number);
    url.searchParams.append("disconame", provider_name);
    url.searchParams.append("mtype", meter_type);
    const req = await axios.get(url.href, {
      headers: { Authorization: AUTH_TOKEN },
    });
    console.log(req.data);
    const isInvalid = req.data?.invalid;
    if (isInvalid === true) {
      return false;
    }
    return true;
  } catch (error) {
    console.log("meter not valid");
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
    } else {
      console.log(error);
    }
    return false;
  }
};

const subvtu_balance = async () => {};

module.exports = {
  subvtu_balance,
  subvtu_recharge,
  subvtu_validate_card,
  subvtu_validate_meter,
};
