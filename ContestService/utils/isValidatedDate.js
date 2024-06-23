function isValidISODate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}

module.exports = isValidISODate;