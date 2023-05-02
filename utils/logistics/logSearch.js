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

  // var onsearch = fs.readFileSync(dirPath + `/${constants.LOG_ONSEARCH}.json`);
  // onsearch = JSON.parse(onsearch);

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
    console.log(`!!Some error occurred while checking /${api} context`, error);
  }

  let search = data.message.intent;
  // onsearch = onsearch.message.catalog;
  try {
    console.log("Checking payment object in case of CoD");
    if (search.hasOwnProperty("fulfillment")) {
      if (search.fulfillment.type === "CoD") {
        const payment = search.payment;
        if (!payment || !payment["@ondc/org/collection_amount"])
          businessErr.paymentErr = `Payment collection amount /payment/@ondc/org/collection_amount is missing`;
      }
    }
  } catch (error) {
    console.log("!!Error while fetching fulfillment object", error);
  }

  try {
    console.log(
      `Checking if dimensions are required in ${constants.LOG_SEARCH}`
    );

    const startPinCode = search.fulfillment.start.location.address.area_code;
    const endPinCode = search.fulfillment.end.location.address.area_code;
    console.log(startPinCode, endPinCode);
    if (startPinCode.slice(0, 3) != endPinCode.slice(0, 3)) {
      if (!search["@ondc/org/payload_details"].hasOwnProperty("dimensions")) {
        businessErr.dimension = `dimensions are mandatory in case of intercity shipments in /@ondc/org/payload_details/dimensions`;
      }
    }
  } catch (error) {
    console.log(
      `!!Error while checking dimensions for /${constants.LOG_SEARCH} api`,
      error
    );
  }

  try {
    console.log(`Checking category in payload details`);
    const ctgry = search["@ondc/org/payload_details"].category;
    if (!utils.logCategory.has(ctgry)) {
      businessErr.pylodCtgry = `category ${search["@ondc/org/payload_details"].category} is not a valid category (should be one of the [allowed categories](https://docs.google.com/spreadsheets/d/1Rj7Hqdvmzup5kAvzbW15NgX5dV4U8c7DtvFopCW_9cc/edit#gid=0))`;
    }
  } catch (error) {}

  result.businessErrors = businessErr;
  // dao.setValue("result", result);
  return result;
};

module.exports = checkSearch;
