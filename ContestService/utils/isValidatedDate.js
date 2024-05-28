function isValidISODate(dateString) {
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
    return isoDatePattern.test(dateString);
}

module.exports = isValidISODate;