const fs = require('fs');

function generateRandomArray(length, max) {
    const array = [];
    for (let i = 0; i < length; i++) {
        array.push(Math.floor(Math.random() * max) + 1);
    }
    return array;
}

function sortArray(array) {
    return array.sort((a, b) => a - b);
}

function createRandomTestCase(inputFilePath, outputFilePath, length, max) {
    const array = generateRandomArray(length, max);

    const input = array.join(' ');
    fs.writeFileSync(inputFilePath, input);
    console.log(`Created input file: ${inputFilePath}`);

    const sortedArray = sortArray([...array]);

    const output = sortedArray.join(' ');
    fs.writeFileSync(outputFilePath, output);
    console.log(`Created output file: ${outputFilePath}`);
}


const length = 10000;
const max = 10;
const inputFilePath = `input_${length}.txt`;
const outputFilePath = `output_${length}.txt`;
createRandomTestCase(inputFilePath, outputFilePath, length, max);