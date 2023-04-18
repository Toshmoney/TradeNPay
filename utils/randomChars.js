function randomChars(str, num=15) {
    if (str.length <= num) {
        if (str.startsWith("0")) {
        return "1" + str.substring(1, num);
        }
        return str;
    }
    let result = '';
    for (let i = 0; i < num; i++) {
        const randomCharacter = str.charAt(Math.floor(Math.random() * str.length))
        if (i === 0 && randomCharacter === "0" ) {
            result = result
        }
        else {
            result += randomCharacter
        }
    }
    return result;
}

function generateTransId () {
    let transaction_id;
    const timestamp = new Date().getTime().toString()
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    transaction_id =  timestamp + randomNumber
    transaction_id = randomChars(transaction_id)
    return transaction_id
}

module.exports = {
    randomChars,
    generateTransId
}
  