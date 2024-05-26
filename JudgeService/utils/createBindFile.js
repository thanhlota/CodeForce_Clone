const fs = require("fs");
const path = require("path");
function createBindFile(relativePath, fileName) {
  const dirPath = path.join(__dirname, relativePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
  const filePath = path.join(dirPath, fileName);
  fs.writeFile(filePath, (err) => {
    if (err) {
      console.error(`Error when create new file: ${err.message}`);
      return null;
    }
    console.log("Create new file successfully!");
    return filePath;
  });
}

module.exports = createBindFile;
