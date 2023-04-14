const schemaValidator = require("../schema/main");
const path = require("path");
const fs = require("fs");

const validateSchema = (domain, api, data) => {
  console.log(`Inside Schema Validation for domain: ${domain}, api: ${api}`);
  const schemaResult = schemaValidator(domain, api, data);
  if (schemaResult.status === "fail") {
    return schemaResult.errors.map(err => {return err.details+" "+err.message})
  } 
  return null
};

module.exports = validateSchema;
