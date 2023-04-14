const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const { checkContext } = require("../../services/service");
const constants = require("../constants");
const validateSchema = require("../schemaValidation");

const checkStatus = (dirPath, msgIdSet) => {
  try {
  let data = fs.readFileSync(dirPath + `/${constants.LOG_STATUS}.json`);
  data = JSON.parse(data);
  return validate("logistics", constants.LOG_STATUS, data, msgIdSet, dirPath);
  }catch (err) {
    if (err.code === "ENOENT") {
      console.log(`!!File not found for /${constants.LOG_STATUS} API!`);
    } else {
      console.log(
        `!!Some error occurred while checking /${constants.LOG_STATUS} API`,
        err
      );
    }
  }
};
const validate = (domain, api, data, msgIdSet, dirPath) => {
  let result = {};
  let status = data;
  
  
   
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
      console.log(`Checking context for /${constants.LOG_STATUS} API`); //checking context
      res = checkContext(status.context, constants.LOG_STATUS);
      if (!res.valid) {
        Object.assign(businessErr, res.ERRORS);
      }
    } catch (error) {
      console.log(
        `!!Some error occurred while checking /${constants.LOG_STATUS} context`,
        error
      );
    }

    try {
      console.log(
        `Comparing city of /${constants.LOG_SEARCH} and /${constants.LOG_STATUS}`
      );
      if (!_.isEqual(dao.getValue("city"), status.context.city)) {
        businessErr.cityErr = `City code mismatch in /${constants.LOG_SEARCH} and /${constants.LOG_STATUS}`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing city in /${constants.LOG_SEARCH} and /${constants.LOG_STATUS}`,
        error
      );
    }

    try {
      console.log(
        `Comparing timestamp of /${constants.LOG_STATUS} and /${constants.LOG_ONCONFIRM}`
      );
      if (_.gte(dao.getValue("tmpstmp"), status.context.timestamp)) {
        dao.setValue("statTmpstmp", status.context.timestamp);
        businessErr.tmpstmpErr = `Timestamp for /${constants.LOG_ONCONFIRM} api cannot be greater than or equal to /${constants.LOG_STATUS} api`;
      }
    } catch (error) {
      console.log(
        `Error while comparing timestamp for /${constants.LOG_ONCONFIRM} and /${constants.LOG_STATUS} api`,
        error
      );
    }

    try {
      console.log(
        `Comparing transaction Ids of /${constants.LOG_SEARCH} and /${constants.LOG_STATUS}`
      );
      if (!_.isEqual(dao.getValue("txnId"), status.context.transaction_id)) {
        businessErr.txnIdErr = `Transaction Id should be same from /${constants.LOG_SEARCH} onwards`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing transaction ids for /${constants.LOG_SEARCH} and /${constants.LOG_STATUS} api`
      );
    }

    try {
      console.log(`Checking Message Id of /${constants.LOG_STATUS}`);
      // if (!_.isEqual(msgId, onSelect.context.message_id)) {
      //   onSlctObj.msgId =
      //     "Message Id for ${constants.LOG_SELECT} and /on_select api should be same";
      // }

      if (msgIdSet.has(status.context.message_id)) {
        businessErr.msgId2Err = `Message Id cannot be same for different sets of APIs`;
      }
      dao.setValue("msgId", status.context.message_id);
      // msgIdSet.add(onSelect.context.message_id);
    } catch (error) {
      console.log(
        `!!Error while checking message id for /${constants.LOG_STATUS}`
      );
    }

    status = status.message;

    try {
      console.log(
        `Comparing order id for /${constants.LOG_CONFIRM} and /${constants.LOG_STATUS}`
      );
      if (dao.getValue("cnfrmOrdrId") != status.order_id) {
        businessErr.orderIdErr = `Order ids in /${constants.LOG_CONFIRM} and /${constants.LOG_STATUS} do not match`;
      }
    } catch (error) {
      console.log(
        `!!Error occurred while comparing order ids /confirm and /${constants.LOG_STATUS}`,
        error
      );
    }
   result.businessErrors=businessErr;
   return result;
    // dao.setValue("businessErr", businessErr);
  } 


module.exports = checkStatus;
