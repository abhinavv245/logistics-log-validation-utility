const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const { checkContext } = require("../../services/service");
const utils = require("../utils");
const constants = require("../constants");
const validateSchema = require("../schemaValidation");

const checkCancel = (dirPath, msgIdSet) => {
  try {
  let data = fs.readFileSync(dirPath + `/${constants.LOG_CANCEL}.json`);
  data = JSON.parse(data);
  return validate("logistics", constants.LOG_CANCEL, data, msgIdSet, dirPath);
  }catch (err) {
    if (err.code === "ENOENT") {
      console.log(`!!File not found for /${constants.LOG_CANCEL} API!`);
    } else {
      console.log(
        `!!Some error occurred while checking /${constants.LOG_CANCEL} API`,
        err
      );
    }
  }
};
const validate = (domain, api, data, msgIdSet, dirPath) => {
  let result = {};
  let cancel=data;

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
    console.log(`Checking context for /${constants.LOG_CANCEL} API`); //checking context
    try {
      res = checkContext(cancel.context, constants.LOG_CANCEL);
      if (!res.valid) {
        Object.assign(businessErr, res.ERRORS);
      }
    } catch (error) {
      console.log(
        `!!Some error occurred while checking /${constants.LOG_CANCEL} context`,
        error
      );
    }

    try {
      console.log(
        `Comparing city of /${constants.LOG_SEARCH} and /${constants.LOG_CANCEL}`
      );
      if (!_.isEqual(dao.getValue("city"), cancel.context.city)) {
        businessErr.cityErr = `City code mismatch in /${constants.LOG_SEARCH} and /${constants.LOG_CANCEL}`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing city in /${constants.LOG_SEARCH} and /${constants.LOG_CANCEL}`,
        error
      );
    }

    try {
      console.log(
        `Comparing timestamp of /${constants.LOG_CANCEL} and /${constants.LOG_ONCONFIRM}`
      );
      if (_.gte(dao.getValue("tmpstmp"), cancel.context.timestamp)) {
        businessErr.tmpstmpErr = `Timestamp for /${constants.LOG_ONCONFIRM} api cannot be greater than or equal to /${constants.LOG_CANCEL} api`;
      }
      dao.setValue("cnclTmpstmp", cancel.context.timestamp);
    } catch (error) {
      console.log(
        `Error while comparing timestamp for /${constants.LOG_ONCONFIRM} and /${constants.LOG_CANCEL} api`,
        error
      );
    }

    try {
      console.log(
        `Comparing transaction Ids of /${constants.LOG_SEARCH} and /${constants.LOG_CANCEL}`
      );
      if (!_.isEqual(dao.getValue("txnId"), cancel.context.transaction_id)) {
        businessErr.txnIdErr = `Transaction Id for /${constants.LOG_SEARCH} and /${constants.LOG_CANCEL} api should be same`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing transaction ids for /${constants.LOG_SEARCH} and /${constants.LOG_CANCEL} api`,
        error
      );
    }

    try {
      console.log(`Checking Message Id of /${constants.LOG_CANCEL}`);
      // if (!_.isEqual(msgId, onSelect.context.message_id)) {
      //   onSlctObj.msgId =
      //     "Message Id for /select and /on_select api should be same";
      // }

      if (msgIdSet.has(cancel.context.message_id)) {
        businessErr.msgId2Err = `Message Id cannot be same for different sets of APIs`;
      }
      dao.setValue("msgId", cancel.context.message_id);
      // msgIdSet.add(onSelect.context.message_id);
    } catch (error) {
      console.log(
        `!!Error while checking message id for /${constants.LOG_CANCEL}`,
        error
      );
    }

    cancel = cancel.message;

    try {
      console.log(
        `Comparing order Id in /${constants.LOG_CANCEL} and /${constants.LOG_CONFIRM}`
      );
      if (cancel.order_id != dao.getValue("cnfrmOrdrId")) {
        console.log(cancel.order_id);
        console.log(dao.getValue("cnfrmOrdrId"))
        businessErr.cancelOrdrIdErr = `Order Id in /${constants.LOG_CANCEL} and /${constants.LOG_CONFIRM} do not match`;
        console.log(
          `Order Id mismatch in /${constants.LOG_CANCEL} and /${constants.LOG_CONFIRM}`
        );
      }
    } catch (error) {
      console.log(
        `Error while comparing order id in /${constants.LOG_CANCEL} and /${constants.LOG_CONFIRM}`,
        error
      );
      // businessErr.cancelOrdrId =
      //   "Order Id in /${constants.LOG_CANCEL} and /${constants.LOG_ONCONFIRM} do not match";
    }

    try {
      console.log("Checking the validity of cancellation reason id");
      if (!(cancel.cancellation_reason_id in utils.cancellation_rid)) {
        console.log(
          `Cancellation Reason Id in /${constants.LOG_CANCEL} is not a valid reason id`
        );

        businessErr.cancelRidErr = `Cancellation reason id in /${constants.LOG_CANCEL} is not a valid reason id`;
      } else dao.setValue("cnclRid", cancel.cancellation_reason_id);
    } catch (error) {
      // businessErr.cancelRid =
      //   "Cancellation reason id in /${constants.LOG_CANCEL} is not a valid reason id";
      console.log(
        `Error while checking validity of cancellation reason id /${constants.LOG_CANCEL}`,
        error
      );
    }
    result.businessErrors=businessErr;
    return result;
    // dao.setValue("businessErr", businessErr);
  } 


module.exports = checkCancel;
