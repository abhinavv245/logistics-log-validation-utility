const schemaValidator1 = require("./retail_api_json_schema/SchemaValidator");
const schemaValidator2 = require("./logistics_api_json_schema/SchemaValidator");


const fs = require("fs");

const validate_schema_json = (vertical, api, data) => {
  switch(vertical){
  case "retail" :
    res = schemaValidator1[`validate_schema_${api}_${vertical}_for_json`](data);
    break;

  case "logistics" :
    res = schemaValidator2[`validate_schema_${api}_${vertical}_for_json`](data);
    break;
  }
 
  return res;
};
// const validate_schema_for_logistics_json = (vertical, api, data) => {
 
//   return res;
// };

module.exports = validate_schema_json;
// module.exports=validate_schema_for_logistics_json;
