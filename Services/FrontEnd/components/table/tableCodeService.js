const fs = require("fs");
var path = require("path");
const CRUDConfigurations = require("../../../../CRUD_Config");

let instance = null;
let tableFolderPath =
  __dirname +
  "../../../../../" +
  CRUDConfigurations.reactAppCodeFolderName +
  "/components/table";

class tableCodeService {
  constructor() {} //i am also here if you need me

  static getInstance() {
    if (!instance) {
      instance = new tableCodeService();
    }
    return instance;
  }

  GenerateTableCode(schemaTable, schemaRelations) {
    let tblName = schemaTable.name;
    var tableCode = this.getImports(tblName); //imports
    tableCode += this.generateClassAndState(tblName);
    tableCode += this.generateMethods(tblName);
    tableCode += this.getTableMethods();
    tableCode += this.generateRenderMethod(tblName);
    tableCode += this.generateTableCode(schemaTable, schemaRelations);
    tableCode += this.getPaginationAndCloseBraces(tblName);
    return tableCode;
  }

  getImports(tblName) {
    var filePath = tableFolderPath + "/imports.txt";
    var code = fs.readFileSync(path.resolve(filePath), "utf8");
    code = code.concat(
      "import { get" +
        tblName +
        "s, delete" +
        tblName +
        ' } from "../../services/' +
        tblName.toLowerCase() +
        'Service";\n\n'
    );
    return code;
  }

  generateClassAndState(tblName) {
    let code = "const " + tblName + "s = () => { \n";
    code += "  const [records, setRecords] = useState([]);\n";
    code += "  \n\n";
    return code;
  }

  generateMethods(tblName) {
    let code = "  useEffect(() =>{\n";
    code +=
      "    (async function anyNameFunction() {\nconst { data:" +
      tblName.toLowerCase() +
      "s } = await get" +
      tblName +
      "s();\n";
    code += "    setRecords(" + tblName.toLowerCase() + "s );\n";
    code += "  })();\n },[]); \n";

    code += " const handleDelete = async id => {\n";
    code += "    const all" + tblName.toLowerCase() + "s = records; \n";
    code +=
      "    const " +
      tblName.toLowerCase() +
      "s = all" +
      tblName.toLowerCase() +
      "s.filter(m => m._id !== id);\n";
    code += "    setRecords(" + tblName.toLowerCase() + "s);\n";
    code += "    try {\n";
    code += "      await delete" + tblName + "(id);\n";
    code += '      console.log("Record Successfully deleted.");\n';
    code += "    } catch (ex) {\n";
    code += "      if (ex.response && ex.response.status === 404) {\n";
    code += '         console.log("The record has already been deleted");\n';
    code += "      }\n";
    code += "      setRecords(all" + tblName.toLowerCase() + "s);\n";
    code += "    }\n";
    code += "};\n";

    //action body code
    code += "const actionBodyTemplate = (record) => {\n";
    code += "return (\n";
    code += "<React.Fragment>\n";
    code += `<Link to={"/${tblName.toLowerCase()}s/" + record._id + ""} className="btn btn-warning btn-sm m-1" >Update</Link>\n`;
    code += `<Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => handleDelete(record._id)}/>\n`;
    code += "</React.Fragment>\n";
    code += ");";
    code += "};";

    return code;
  }

  getTableMethods() {
    var filePath = tableFolderPath + "/tableMethods.txt";
    var code = fs.readFileSync(path.resolve(filePath), "utf8");
    return code;
  }

  generateRenderMethod(tblName) {
    let code = "";
    code += "    return (\n";
    code += "      <React.Fragment>\n";
    code += '            <div className="row mt-4">\n';
    code += '              <div className="col-sm-5">\n';
    code += "                    <Link\n";
    code += '                      to="/' + tblName.toLowerCase() + 's/new"\n';
    code += '                      className="btn btn-primary custom-btn"\n';
    code += "                      style={{ marginBottom: 20 }}\n";
    code += "                    >\n";
    code += "                     New " + tblName + "\n";
    code += "                    </Link>\n";
    code += "              </div>\n";
    code += "              { (records.length === 0)?\n";
    code += '                <div className="col-sm-4">\n';
    code +=
      "                   <p>There are no records to show create a record</p>\n";
    code += "                </div>\n";
    code += "                : \n";
    code += '                <div className="col-sm-2">\n';
    code +=
      "                   <p>There are {records.length} " +
      tblName.toLowerCase() +
      "s</p>\n";
    code += "                </div>\n";
    code += "              }\n";
    code += "          </div>\n";
    return code;
  }

  generateTableCode(schemaTable, schemaRelations) {
    let tblName = schemaTable.name;
    let tblColumns = schemaTable.columns;
    let firstTable, secondTable, relationType;
    let tableCode = "";
    let keyValue = 0;
    tableCode +=
      '            <DataTable value={records} dataKey="_id" paginator paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10, 20, 50]} className="p-datatable-striped">\n\n<Column field="_id" header="_id" filter sortable></Column>';
    for (var column in tblColumns) {
      keyValue = keyValue + 1;
      tableCode = tableCode.concat(
        `<Column field="${tblColumns[column].name}" header="${tblColumns[column].name}" filter sortable></Column>`
      );
    }
    tableCode += "<Column body={actionBodyTemplate}></Column>\n</DataTable>";
    return tableCode;
  }

  getPaginationAndCloseBraces(tblName) {
    var filePath = tableFolderPath + "/paginationAndClose.txt";
    var code = fs.readFileSync(path.resolve(filePath), "utf8");
    code = code.concat("export default " + tblName + "s;\n");
    return code;
  }
}

module.exports = tableCodeService;
