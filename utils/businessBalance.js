require('dotenv').config()

var axios = require('axios');
var data = '';

var config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://enterprise.mobilenig.com/api/control/balance',
  headers: { 
    'Content-Type': 'application/json', 
    'Authorization': `Bearer ${process.env.API_PUBLIC_KEY}`
  },
    data : data
};

const businessBalance = async () => {
  try {
    const response = await axios(config)
    const { data } = await response
    const balance = await data.details.balance
    return Number(balance) || 0
  } catch (error) {
    return 0
  }
}

module.exports = businessBalance