const fs = require('fs');
const path = require('path');
function readFile(filePath) {
    try {
        const absolutePath = path.join(__dirname, filePath);
        const fileContent = fs.readFileSync(absolutePath, 'utf8');
        return fileContent;
    }
    catch (e) {
        console.log('e', e);
    }

}

module.exports = readFile;