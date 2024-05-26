const fs = require("fs");
const path = require("path");
function readFile(filePath) {
  try {
    const absolutePath = path.join(__dirname, filePath);
    const fileContent = fs.readFileSync(absolutePath, { encoding: "utf8", flag: "r" });
    return transferString(fileContent);
  } catch (e) {
    console.log("e", e);
  }
}

function transferString(string) {
  const newString = string.replace(/"/g, '\\"');
  return newString;
}
module.exports = readFile;
