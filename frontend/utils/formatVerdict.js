const formatVerdict = (str) => {
    let upperStr = str.toUpperCase();
    let snakeCaseStr = upperStr.replace(/\s+/g, '_');
    return snakeCaseStr;
};

export default formatVerdict;

