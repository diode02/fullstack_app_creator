const fs = require("fs");

const appFileService = require("./appFile/appFileService");
const modelService = require("./models/modelsService");
const routeService = require("./routes/routesService");
const packageFileService = require("./packageFile/packageService");
const authFilesService = require("./authFilesService");
const sampleRecordService = require("./sampleRecord/sampleRecordService");
const configService = require("./configFile/configService");

let instance = null;
let appFileServiceObj = null;
let modelServiceObj = null;
let routeServiceObj = null;
let packageFileServiceObj = null;
let sampleRecordServiceObj = null;
let authFilesServiceObj = null;
let configServiceObj = null;

class BackEndService {
  constructor() {
    appFileServiceObj = appFileService.getInstance();
    modelServiceObj = modelService.getInstance();
    routeServiceObj = routeService.getInstance();
    packageFileServiceObj = packageFileService.getInstance();
    authFilesServiceObj = authFilesService.getInstance();
    sampleRecordServiceObj = sampleRecordService.getInstance();
    configServiceObj = configService.getInstance();
  }

  static getInstance() {
    if (!instance) {
      instance = new BackEndService();
    }
    return instance;
  }

  generateBackend(scheema, projectFolderPath) {
    try {
      let FilesGenerated = true;
      //....................CRUD Releated Folders................
      //create Project folder if not exist
      if (!fs.existsSync(projectFolderPath)) {
        fs.mkdirSync(projectFolderPath);
      }

      //create src folder
      let srcFolder = projectFolderPath + "/src/";
      if (!fs.existsSync(srcFolder)) {
        fs.mkdirSync(srcFolder);
      }

      //create middlewares folder
      let middlewaresFolder = projectFolderPath + "/src/middlewares/";
      if (!fs.existsSync(middlewaresFolder)) {
        fs.mkdirSync(middlewaresFolder);
      }

      //create the models folder
      let modelsFolderPath = projectFolderPath + "/src/models";
      if (!fs.existsSync(modelsFolderPath)) {
        fs.mkdirSync(modelsFolderPath);
      }
      //create the routes folder
      let routuesFolderPath = projectFolderPath + "/routes";
      if (!fs.existsSync(routuesFolderPath)) {
        fs.mkdirSync(routuesFolderPath);
      }

      //create the middlwares folder
      let middlewaresFolderPath = projectFolderPath + "/src/middlewares";
      if (!fs.existsSync(middlewaresFolderPath)) {
        fs.mkdirSync(middlewaresFolderPath);
      }

      //...........................................Other Folders..........................................

      //create the services folder
      let serviceFolderPath = projectFolderPath + "/src/services";
      if (!fs.existsSync(serviceFolderPath)) {
        fs.mkdirSync(serviceFolderPath);
      }

      //create the services folder
      let sampleFolderPath = projectFolderPath + "/src/sampleRecord";
      if (!fs.existsSync(sampleFolderPath)) {
        fs.mkdirSync(sampleFolderPath);
      }
      //.............Other files
      //User Authentication Files
      FilesGenerated = authFilesServiceObj.generateAuthFile(
        "/src/models/",
        modelsFolderPath,
        "User.model",
        ".js"
      );
      FilesGenerated = authFilesServiceObj.generateAuthFile(
        "/routes/",
        routuesFolderPath,
        "users.routes",
        ".js"
      );
      FilesGenerated = authFilesServiceObj.generateAuthFile(
        "/src/middlewares/",
        middlewaresFolderPath,
        "auth",
        ".js"
      );
      FilesGenerated = authFilesServiceObj.generateAuthFile(
        "/src/services/",
        serviceFolderPath,
        "validation",
        ".js"
      );
      //Main/project folder files
      FilesGenerated = packageFileServiceObj.generatePackageFile(
        projectFolderPath,
        "package",
        ".json"
      );
      FilesGenerated = configServiceObj.generateConfigurations(
        projectFolderPath,
        "config",
        ".js"
      );

      FilesGenerated = sampleRecordServiceObj.generateSampleRecordFile(
        sampleFolderPath,
        "sampleRecord.js"
      );
      //.................................CRUD Files....................................................................

      var tables = null;
      var relations = null;
      if (scheema.hasOwnProperty("tables")) {
        //as tables is a optional property
        tables = scheema.tables;
      }
      if (scheema.hasOwnProperty("relations")) {
        //as relations is a optional property
        relations = scheema.relations;
      }
      //.......1.Common CRUD Files...............
      FilesGenerated = appFileServiceObj.generateAppFile(
        tables,
        projectFolderPath,
        "app.js"
      );

      //.......2.CRUD Files...............
      if (scheema == {}) {
        //if scheema passed is empty array this means user wants only auth files so return
        //don,t go for the crud files
        return FilesGenerated;
      }

      for (var tableId in tables) {
        FilesGenerated = modelServiceObj.generateModel(
          tables[tableId],
          tables,
          relations,
          modelsFolderPath
        );
        FilesGenerated = routeServiceObj.generateRouteFile(
          tables[tableId],
          relations,
          routuesFolderPath
        );
      }
      return FilesGenerated;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}

module.exports = BackEndService;
