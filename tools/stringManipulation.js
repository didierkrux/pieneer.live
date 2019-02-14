class StringManipulation {
    static sixPad(num) {
        return (num.toString()).padStart(6, '0');
    }
}

module.exports = StringManipulation;