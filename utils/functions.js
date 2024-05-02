const generateRandomTLV = (mobile) => {
    const prefix = "MI";
    const number = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    let value = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 7; i++) {
        value += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return `${prefix}${number}${value}${mobile}`;
}


const generateInvoiceNumber = () => {
    const min = 0;
    const max = 9999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    const paddedNumber = randomNumber.toString().padStart(4, '0');
    return "INV" + paddedNumber;
}

module.exports = { generateRandomTLV, generateInvoiceNumber };