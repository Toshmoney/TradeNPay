require("dotenv").config()
const { default: axios } = require("axios")

const fetchPackages = async (req, res) => {
    try {
        const response = await axios.post(
            'https://enterprise.mobilenig.com/api/services/packages',
            {
                ...req.body
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':  `Bearer ${process.env.API_PUBLIC_KEY}`
                }
            }
        )
        let details = await response.data.details
        return res.status(200).json(details)
    } 
    catch (error) {
        return res.status(422).json({
            message: 'unable to handle request'
        })
    }
}

module.exports = {
    fetchPackages
}