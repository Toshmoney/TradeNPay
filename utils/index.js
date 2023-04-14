const axios = require('axios')

const service_ids = {
    'mtn': { service_id:'BCA', requestType:'SME' },
    '9mobile': { service_id:'BCB', requestType:'GIFTING' },
    'glo': { service_id:'BCC', requestType:'GIFTING' },
    'airtel': { service_id:'BCD', requestType:'GIFTING' }
}

const getStatus = async (service_id='BCA', requestType='SME') => {
    try {
        const response = await axios.post(
            'https://enterprise.mobilenig.com/api/services/proxy',
            {
                "service_id": service_id,
                "requestType": requestType
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer pk_test_7Uijgj3YbGLFSjlf73aQCCRJbhPs+IP7+YZZci3HU9A=`
                }
            }
        )
        console.log(response.data);
        return response.data
    } 
    catch (error) {
        console.log(error);
    }
}

const fetchPrices = async (service_id='BCA', requestType='SME') => {
    try {
        const response = await axios.post(
            'https://enterprise.mobilenig.com/api/services/packages',
            {
                "service_id": service_id,
                "requestType": requestType
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer pk_test_7Uijgj3YbGLFSjlf73aQCCRJbhPs+IP7+YZZci3HU9A=`
                }
            }
        )
        let details = await response.data.details
        details = details.filter(detail => detail.status === '1')
        return details
    } 
    catch (error) {
        console.log(error);
    }
}

fetchPrices()

module.exports = {
    getStatus,
    fetchPrices
}
