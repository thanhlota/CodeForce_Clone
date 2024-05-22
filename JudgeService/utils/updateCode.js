const fs = require('fs');

function updateCode(filePath, code) {
    // Thay thế nội dung của file
    fs.writeFile(filePath, code, (err) => {
        if (err) {
            console.error('ERROR:', err);
        } else {
            console.log('Update code successfully!');
        }
    });
}

module.exports = updateCode;
