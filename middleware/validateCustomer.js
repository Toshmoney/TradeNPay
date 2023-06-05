require("dotenv").config()
const { default: axios } = require("axios")

const validateCustomer = async (req, res, next) => {
    const response = await axios.post(
        'https://enterprise.mobilenig.com/api/services/proxy',
        req.body,
        {
            headers: {
                'Authorization': `Bearer ${process.env.API_PUBLIC_KEY}`,
                "Content-Type": 'application/json' 
            }
        }
    )
    const { data } = response
    console.log(data);
    if (data.message !== 'success' || !data.details || typeof data.details !== 'object') {
        return res.status(400).json({
            message: data.details,
            error: 'validation'
        })
    }
    req.customerDetails = data.details
   
    next()
}

module.exports = {
    validateCustomer
}