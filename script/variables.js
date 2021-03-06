const fs = require('fs');
const path = require("path");

const args = process.argv.slice(2);
const indexOf = args.indexOf("--subprojectPath");
let pathToJoin = "";
if(indexOf > -1 && args.length > indexOf+1){
    pathToJoin = args[indexOf+1];
}

const newPath = path.join(__dirname, "../", pathToJoin);
const pkg = require(path.join(newPath, "package.json"));

let extension = "tsx";

try {
    if(!fs.existsSync(path.join(newPath, `/src/${pkg.widgetName}.${extension}`))){
        extension = "jsx";
    }
} catch(err) {
    extension = "jsx";
}

module.exports = {
    path: newPath,
    package: pkg,
    extension: extension
};
