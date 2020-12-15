const fs = require("fs");
var path = require("path");
const CRUDConfigurations = require("../../../CRUD_Config");

let instance = null;
let appFilesFolderPath =
  __dirname +
  "../../../../" +
  CRUDConfigurations.NativeAppCodeFolderName +
  "/appFile";

class appFileCodeService {
  constructor() {} //i am also here if you need me

  static getInstance() {
    if (!instance) {
      instance = new appFileCodeService();
    }
    return instance;
  }

  GetAppFileCode(schemaTables) {
    var appFileCode = this.getImports(schemaTables); //imports
    appFileCode += this.getAppFileClassAndRender();
    appFileCode += this.getSpecificScreen(schemaTables); // all close braces and exports
    // appFileCode += this.getAppFileRoutes(); // all close braces and exports
    // appFileCode += this.getIndexRoute(schemaTables); // all close braces and exports
    appFileCode += this.getAppFileRemains();
    return appFileCode;
  }

  getImports(schemaTables) {
    let tblName;
    var filePath = appFilesFolderPath + "/appImports.txt";
    var code = fs.readFileSync(path.resolve(filePath), "utf8");
    if (schemaTables == null) {
      // code = code.concat('import SampleComponent from "./components/sampleComponent";\n');
    } else {
      for (var tableId in schemaTables) {
        tblName = schemaTables[tableId].name;
        code = code.concat(
          "import " +
            tblName +
            'Screen from "./src/screens/' +
            tblName.toLowerCase() +
            'Screen";\n'
        );
        // code = code.concat(
        //   "import " +
        //     tblName +
        //     'Form from "./components/' +
        //     tblName.toLowerCase() +
        //     "/" +
        //     tblName.toLowerCase() +
        //     'Form";\n'
        // );
        // code = code.concat(
        //   "import " +
        //     tblName +
        //     'Details from "./components/' +
        //     tblName.toLowerCase() +
        //     "/" +
        //     tblName.toLowerCase() +
        //     'Details";\n'
        // );
      }
    }
    return code;
  }

  getAppFileClassAndRender() {
    var filePath = appFilesFolderPath + "/appClassAndRender.txt";
    var code = fs.readFileSync(path.resolve(filePath), "utf8");
    return code;
  }

  getSpecificScreen(schemaTables) {
    let tblName,
      code = "";
    if (schemaTables == null) {
      // code = code.concat("            <Route\n");
      // code = code.concat('                path="/sampleComponent" \n');
      // code = code.concat("                render={props => {\n");
      // code = code.concat(
      //   '                  if (!auth.isUserLoggedIn()) return <Redirect to="/login" />;\n'
      // );
      // code = code.concat(
      //   "                  return <SampleComponent {...props} />;\n"
      // );
      // code = code.concat("                }}\n");
      // code = code.concat("            />\n");
    } else {
      for (var tableId in schemaTables) {
        tblName = schemaTables[tableId].name;
        code = code.concat(`${tblName}: ${tblName}Screen,\n`);
      }
    }
    return code;
  }

  getAppFileRoutes() {
    var filePath = appFilesFolderPath + "/appRoutes.txt";
    var code = fs.readFileSync(path.resolve(filePath), "utf8");
    return code;
  }

  getIndexRoute(schemaTables) {
    let code = "";
    if (schemaTables == null) {
      code += '\n            <Redirect from="/" exact to="/sampleComponent" />';
    } else {
      let tblName = schemaTables[0].name;
      code +=
        '\n            <Redirect from="/" exact to="/' +
        tblName.toLowerCase() +
        's" />';
    }
    return code;
  }

  getAppFileRemains() {
    var filePath = appFilesFolderPath + "/appRemains.txt";
    var code = fs.readFileSync(path.resolve(filePath), "utf8");
    return code;
  }
}

module.exports = appFileCodeService;
