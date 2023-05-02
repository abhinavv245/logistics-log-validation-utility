const dao = require("../../dao/dao");
const fs = require("fs");
const utils = require("../utils");
const constants = require("../constants");
const { checkContext } = require("../../services/service");
const validateSchema = require("../schemaValidation");

const checkSearch = (dirPath, msgIdSet) => {
  try {
    let data = fs.readFileSync(dirPath + `/${constants.LOG_SEARCH}.json`);
    data = JSON.parse(data);
    return validate("logistics", constants.LOG_SEARCH, data, msgIdSet, dirPath);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`!!File not found for /${constants.LOG_SEARCH} API!`);
    } else {
      console.log(
        `!!Some error occurred while checking /${constants.LOG_SEARCH} API`,
        err
      );
    }
  }
};

const validate = (domain, api, data, msgIdSet, dirPath) => {
  let result = {};
  try {
    var onsearch = fs.readFileSync(dirPath + `/${constants.LOG_ONSEARCH}.json`);
    onsearch = JSON.parse(onsearch);

    try {
      console.log(`Validating Schema for ${api} API`);
      const schemaFailures = validateSchema(domain, api, data);
      if (schemaFailures != null) {
        result.schemaError = schemaFailures;
      }
    } catch (error) {
      console.log(
        "!!Error occurred while performing schema validation for",
        api,
        error
      );
    }

    const businessErr = {};
    try {
      res = checkContext(data.context, api);
      if (!res.valid) {
        Object.assign(businessErr, res.ERRORS);
        // result.businessErr = res.ERRORS;
      }

      dao.setValue("tmpstmp", data.context.timestamp);
      dao.setValue("txnId", data.context.transaction_id);
      dao.setValue("msgId", data.context.message_id);
      dao.setValue("city", data.context.city);
      msgIdSet.add(data.context.message_id);
      console.log(dao.getValue("txnId"));
    } catch (error) {
      console.log(
        `!!Some error occurred while checking /${api} context`,
        error
      );
    }

    let search = data.message.intent;
    onsearch = onsearch.message.catalog;
    try {
      console.log("Checking payment object in case of CoD");
      if (search.hasOwnProperty("fulfillment")) {
        if (search.fulfillment.type === "CoD") {
          const payment = search.fulfillment.payment;
          if (!payment)
            businessErr.paymentErr = `Payment object missing in fulfillment object in /${api} API`;
        }
      }
    } catch (error) {
      console.log("!!Error while fetching fulfillment object", error);
    }
  
    try {
      console.log(`Checking if dimensions are required in ${constants.LOG_SEARCH}`);
      if (onsearch.hasOwnProperty("bpp/providers")) {
        if (onsearch["bpp/providers"][0].items[0].descriptor.code === "P2H2P") {
         if(search.hasOwnProperty("@ondc//org/payload_details")){
          const dimension=search["@ondc//org/payload_details"].dimensions;
          if(!dimension)
          businessErr.dimensionErr = `Dimensions are required in case of intercity shipments in /${api} API`;
         }
        } 
      }
    } catch (error) {
      console.log(
        `!!Error while checking dimensions for /${constants.LOG_SEARCH} api`,
        error
      );
    }
   
    result.businessErrors = businessErr;
    // dao.setValue("result", result);
    return result;
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`!!File not found for /${constants.LOG_ONSEARCH} API!`);
    } else {
      console.log(
        `!!Some error occurred while checking /${constants.LOG_ONSEARCH} API`,
        err
      );
    }
  }
};

module.exports = checkSearch;
