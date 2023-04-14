const { fetchPrices } = require("../utils")

const fetchDataPrices = async ( req, res ) => {
    const {
        service_id,
        requestType
    } = req.body
    try {
        const details = await fetchPrices(service_id, requestType)
        return res.status(200).json(details)
    } 
    catch (error) {
        return res.status(500).json({
            message: 'unable to handle error'
        })
    }
}

module.exports = {
    fetchDataPrices
}