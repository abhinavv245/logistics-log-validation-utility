const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const { checkContext } = require("../../services/service");
const utils = require("../utils");
const validateSchema = require("../schemaValidation");
const constants = require("../constants");

const checkOnStatus = (dirPath, msgIdSet) => {
  try {
  let data = fs.readFileSync(dirPath + `/${constants.LOG_ONSTATUS}.json`);
  data = JSON.parse(data);
  return validate("logistics", constants.LOG_ONSTATUS, data, msgIdSet, dirPath);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`!!File not found for /${constants.LOG_ONSTATUS} API!`);
    } else {
      console.log(
        `!!Some error occurred while checking /${constants.LOG_ONSTATUS} API`,
        err
      );
    }
  }
};
const validate = (domain, api, data, msgIdSet, dirPath) => {
  let result = {};
  let on_status = data;
  try {
   
    let confirm = fs.readFileSync(dirPath + `/${constants.LOG_CONFIRM}.json`);
    confirm = JSON.parse(confirm);
   
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
      console.log("Checking context for /${constants.LOG_ONSTATUS} API"); //checking context
      res = checkContext(on_status.context, "on_status");
      if (!res.valid) {
        Object.assign(businessErr, res.ERRORS);
      }
    } catch (error) {
      console.log(
        `!!Some error occurred while checking /${constants.LOG_ONSTATUS} context`,
        error
      );
    }

    try {
      console.log(
        `Comparing city of ${constants.LOG_SEARCH} and /${constants.LOG_ONSTATUS}`
      );
      if (!_.isEqual(dao.getValue("city"), on_status.context.city)) {
        businessErr.cityErr = `City code mismatch in ${constants.LOG_SEARCH} and /${constants.LOG_ONSTATUS}`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing city in ${constants.LOG_SEARCH} and /${constants.LOG_ONSTATUS}`,
        error
      );
    }

    try {
      console.log(
        `Comparing timestamp of /${constants.LOG_ONSTATUS} and /${constants.LOG_ONCONFIRM}`
      );
      if (_.gte(dao.getValue("tmpstmp"), on_status.context.timestamp)) {
        businessErr.tmpstmpErr = `Timestamp for /${constants.LOG_ONCONFIRM} api cannot be greater than or equal to /${constants.LOG_ONSTATUS} api`;
      }
    } catch (error) {
      console.log(
        `Error while comparing timestamp for /${constants.LOG_ONCONFIRM} and /${constants.LOG_ONSTATUS} api`,
        error
      );
    }

    try {
      console.log(
        `Comparing timestamp of /${constants.LOG_STATUS} and /${constants.LOG_ONSTATUS}`
      );
      if (_.gte(dao.getValue("statTmpstmp"), on_status.context.timestamp)) {
        businessErr.tmpstmp2Err = `Timestamp for /${constants.LOG_STATUS} api cannot be greater than or equal to /${constants.LOG_ONSTATUS} api`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing timestamp for /${constants.LOG_STATUS} and /${constants.LOG_ONSTATUS} api`,
        error
      );
    }

    try {
      console.log(
        `Comparing transaction Ids of /search and /${constants.LOG_ONSTATUS}`
      );
      if (!_.isEqual(dao.getValue("txnId"), on_status.context.transaction_id)) {
        businessErr.txnIdErr = `Transaction Id should be same from /${constants.LOG_SEARCH} onwards`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing transaction ids for /${constants.LOG_SEARCH} and /${constants.LOG_ONSTATUS} api`,
        error
      );
    }

    try {
      console.log(`Checking Message Id of /${constants.LOG_ONSTATUS}`);
      if (!_.isEqual(dao.getValue("msgId"), on_status.context.message_id)) {
        businessErr.msgIdErr = `Message Id for /${constants.LOG_STATUS} and /${constants.LOG_ONSTATUS} api should be same`;
      }

      // if (msgIdSet.has(status.context.message_id)) {
      //   statObj.msgId2 = "Message Id cannot be same for different sets of APIs";
      // }
      // msgId = status.context.message_id;
      msgIdSet.add(on_status.context.message_id);
    } catch (error) {
      console.log(
        `!!Error while checking message id for /${constants.LOG_ONSTATUS}`,
        error
      );
    }

    on_status = on_status.message.order;
    confirm = confirm.message.order;

    try {
      console.log(
        `Comparing order Id in /${constants.LOG_ONCONFIRM} and /${constants.LOG_ONSTATUS}`
      );
      if (on_status.id != dao.getValue("cnfrmOrdrId")) {
        console.log(
          `Order id (/${constants.LOG_ONSTATUS}) mismatches with /${constants.LOG_CONFIRM})`
        );
        businessErr.onStatusOdrIdErr = `Order id in /${constants.LOG_CONFIRM} and /${constants.LOG_ONSTATUS} do not match`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing order id in /${constants.LOG_ONSTATUS} and /${constants.LOG_CONFIRM}`,
        error
      );
      // businessErr.onStatusOrdrId =
      //   "Order id mismatches in /${constants.LOG_ONCONFIRM} and /${constants.LOG_ONSTATUS}";
    }

    try {
      console.log(`Checking provider locations in ${constants.LOG_ONSTATUS}`);
      if (confirm.hasOwnProperty("provider").hasOwnProperty("locations")) {
        if (!on_status.hasOwnProperty("provider").hasOwnProperty("locations"))
          businessErr.providerLocationErr = `Provider location is missing in ${constants.LOG_ONSTATUS}`;
      }
    } catch (error) {
      console.log(
        `!!Error while checking order provider locations in /${constants.LOG_ONSTATUS}`,
        error
      );
    }

    try {
      console.log(`Checking timestamp in ${constants.LOG_ONSTATUS}`);
      if (on_status.hasOwnProperty("fulfillments")) {
        const fulfillmentState =
          on_status.fulfillments[0].state.descriptor.code;

        if (
          fulfillmentState === "Order-picked-up" ||
          fulfillmentState === "Out-for-delivery" ||
          fulfillmentState === "Order-delivered" ||
          fulfillmentState === "RTO-Initiated" ||
          fulfillmentState === "RTO-Delivered" ||
          fulfillmentState === "RTO-Disposed"
        ) {
          const strtTmstamp = on_status.fulfillments[0].start.time.timestamp;
          if (!strtTmstamp)
            businessErr.timestampErr = `Start Timestamp is required for this fulfillment state in ${constants.LOG_ONSTATUS} api`;
          if (fulfillmentState === "Order-delivered") {
            const endTmstamp = on_status.fulfillments[0].end.time.timestamp;
            if (!endTmstamp)
              businessErr.timestampErr = `End Timestamp is required for this fulfillment state in ${constants.LOG_ONSTATUS} api`;
          }
        }
      }
    } catch (error) {
      console.log(
        `!!Error while checking timestamps in fulfillments in /${constants.LOG_ONSTATUS}`,
        error
      );
    }

    result.businessErrors=businessErr;
    return result;
   
    // dao.setValue("businessErr", businessErr);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`!!File not found for /${constants.LOG_ONSTATUS} API!`);
    } else {
      console.log(
        `!!Some error occurred while checking /${constants.LOG_ONSTATUS} API`,
        err
      );
    }
  }
};

module.exports = checkOnStatus;
