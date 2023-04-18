require('dotenv').config
const { default: axios } = require("axios")

const transactionQuery = async (reference_number) => {
    try {
        if (!reference_number) {
            throw new Error('transaction reference not provided')
        }
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://enterprise.mobilenig.com/api/services/query?trans_id=${reference_number}`,
            headers: { 
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${process.env.API_SECRET_KEY}`
            }
        };
        const response = await axios(config)
        const { data } = response
        return data
    } 
    catch (error) {
        console.log(error);
    }
}

module.exports = {
    transactionQuery
}