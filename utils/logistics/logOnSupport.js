const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const { checkContext } = require("../../services/service");
const utils = require("../utils");
const validateSchema = require("../schemaValidation");
const constants = require("../constants");

const checkOnSupport = (dirPath, msgIdSet) => {
    try {
  let data = fs.readFileSync(dirPath + `/${constants.LOG_ONSUPPORT}.json`);
  data = JSON.parse(data);
  return validate("logistics", constants.LOG_ONSUPPORT, data, msgIdSet, dirPath);
    }catch (err) {
      if (err.code === "ENOENT") {
        console.log(`!!File not found for /${constants.LOG_ONSUPPORT} API!`);
      } else {
        console.log(
          `!!Some error occurred while checking /${constants.LOG_ONSUPPORT} API`,
          err
        );
      }
    }
};
const validate = (domain, api, data, msgIdSet, dirPath) => {
  let result = {};
  let on_support=data;

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
      console.log(`Checking context for /${constants.LOG_ONSUPPORT} API`); //checking context
      res = checkContext(on_support.context, constants.LOG_ONSUPPORT);
      if (!res.valid) {
        Object.assign(businessErr, res.ERRORS);
      }
    } catch (error) {
      console.log(
        `!!Some error occurred while checking /${constants.LOG_ONSUPPORT} context`,
        error
      );
    }

    try {
      console.log(
        `Comparing city of /${constants.LOG_SEARCH} and /${constants.LOG_ONSUPPORT}`
      );
      if (!_.isEqual(dao.getValue("city"), on_support.context.city)) {
        businessErr.cityErr = `City code mismatch in /${constants.LOG_SEARCH} and /${constants.LOG_ONSUPPORT}`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing city in /${constants.LOG_SEARCH} and /${constants.LOG_ONSUPPORT}`,
        error
      );
    }

    try {
      console.log(
        `Comparing timestamp of /${constants.LOG_SUPPORT} and /${constants.LOG_ONSUPPORT}`
      );
      if (_.gte(dao.getValue("sprtTmpstmp"), on_support.context.timestamp)) {
        businessErr.tmpstmpErr = `Timestamp for /${constants.LOG_SUPPORT} api cannot be greater than or equal to /${constants.LOG_ONSUPPORT} api`;
      }
    } catch (error) {
      console.log(
        `Error while comparing timestamp for /${constants.LOG_SUPPORT} and /${constants.LOG_ONSUPPORT} api`
      );
    }

    try {
      console.log(
        `Comparing transaction Ids of /${constants.LOG_SEARCH} and /${constants.LOG_ONSUPPORT}`
      );
      if (
        !_.isEqual(dao.getValue("txnId"), on_support.context.transaction_id)
      ) {
        businessErr.txnIdErr = `transaction_id should be same from /${constants.LOG_SEARCH} onwards`;
      }
    } catch (error) {
      console.log(
        `Error while comparing transaction ids for /${constants.LOG_SEARCH} and /${constants.LOG_ONSUPPORT} api`,
        error
      );
    }

    try {
      console.log("Checking Message Id of /on_support");
      if (!_.isEqual(dao.getValue("msgId"), on_support.context.message_id)) {
        businessErr.msgIdErr = `Message Id for /${constants.LOG_SUPPORT} and /${constants.LOG_ONSUPPORT} api should be same`;
      }

      // if (msgIdSet.has(status.context.message_id)) {
      //   statObj.msgId2 = "Message Id cannot be same for different sets of APIs";
      // }
      // msgId = status.context.message_id;
      msgIdSet.add(on_support.context.message_id);
    } catch (error) {
      console.log(
        `Error while checking message id for /${constants.LOG_ONSUPPORT}`,
        error
      );
    }

    on_support = on_support.message;
   result.businessErrors=businessErr;
   return result;
    // dao.setValue("businessErr", businessErr);
  } 


module.exports = checkOnSupport;
