const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const { checkContext } = require("../../services/service");
const constants = require("../constants");
const validateSchema = require("../schemaValidation");

const checkOnCancel = (dirPath, msgIdSet) => {
  try {
  let data = fs.readFileSync(dirPath + `/${constants.LOG_ONCANCEL}.json`);
  data = JSON.parse(data);
  return validate("logistics", constants.LOG_ONCANCEL, data, msgIdSet, dirPath);
  }catch (err) {
    if (err.code === "ENOENT") {
      console.log(`!!File not found for /${constants.LOG_ONCANCEL} API!`);
    } else {
      console.log(
        `!!Some error occurred while checking /${constants.LOG_ONCANCEL} API`,
        err
      );
    }
  }
};
const validate = (domain, api, data, msgIdSet, dirPath) => {
  let on_cancel=data;
  let result = {};
  let onCnclObj = {};

 
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
      console.log(`Checking context for /${constants.LOG_ONCANCEL} API`); //checking context
      res = checkContext(on_cancel.context, api);
      if (!res.valid) {
        Object.assign(businessErr, res.ERRORS);
      }
    } catch (error) {
      console.log(
        `!!Some error occurred while checking /${constants.LOG_ONCANCEL} context`,
        error
      );
    }
    try {
      console.log(
        `Comparing city of /${constants.LOG_SEARCH} and /${constants.LOG_ONCANCEL}`
      );
      if (!_.isEqual(dao.getValue("city"), on_cancel.context.city)) {
        onCnclObj.city = `City code mismatch in /${constants.LOG_SEARCH} and /${constants.LOG_ONCANCEL}`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing city in /${constants.LOG_SEARCH} and /${constants.LOG_ONCANCEL}`,
        error
      );
    }

    try {
      console.log(
        `Comparing timestamp of /${constants.LOG_ONCANCEL} and /${constants.LOG_ONCONFIRM}`
      );
      if (_.gte(dao.getValue("tmpstmp"), on_cancel.context.timestamp)) {
        onCnclObj.tmpstmp = `Timestamp for /${constants.LOG_ONCONFIRM} api cannot be greater than or equal to /${constants.LOG_ONCANCEL} api`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing timestamp for /${constants.LOG_ONCONFIRM} and /${constants.LOG_ONCANCEL} api`,
        error
      );
    }

    try {
      console.log(
        `Comparing timestamp of /${constants.LOG_CANCEL} and /${constants.LOG_ONCANCEL}`
      );
      if (_.gte(dao.getValue("cnclTmpstmp"), on_cancel.context.timestamp)) {
        onCnclObj.tmpstmp = `Timestamp for /${constants.LOG_CANCEL} api cannot be greater than or equal to /${constants.LOG_ONCANCEL} api`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing timestamp for /${constants.LOG_CANCEL} and /${constants.LOG_ONCANCEL} api`,
        error
      );
    }

    try {
      console.log(
        `Comparing transaction Ids of /${constants.LOG_SEARCH} and /${constants.LOG_ONCANCEL}`
      );
      if (!_.isEqual(dao.getValue("txnId"), on_cancel.context.transaction_id)) {
        onCnclObj.txnId = `Transaction Id for /${constants.LOG_SEARCH} and /${constants.LOG_ONCANCEL} api should be same`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing transaction ids for /${constants.LOG_SEARCH} and /${constants.LOG_ONCANCEL} api`,
        error
      );
    }
    try {
      console.log(`Checking Message Id of /${constants.LOG_ONCANCEL}`);
      if (!_.isEqual(dao.getValue("msgId"), on_cancel.context.message_id)) {
        onCnclObj.msgId = `Message Id for /${constants.LOG_CANCEL} and /${constants.LOG_ONCANCEL} api should be same`;
      }
      // if (msgIdSet.has(status.context.message_id)) {
      //   statObj.msgId2 = "Message Id cannot be same for different sets of APIs";
      // }
      // msgId = status.context.message_id;
      msgIdSet.add(on_cancel.context.message_id);
    } catch (error) {
      console.log(
        `!!Error while checking message id for /${constants.LOG_ONCANCEL}`,
        error
      );
    }
    on_cancel = on_cancel.message.order;

    try {
      console.log(
        `Comparing order id in /${constants.LOG_ONCANCEL} and /${constants.LOG_CONFIRM}`
      );
      if (on_cancel.id != dao.getValue("cnfrmOrdrId")) {
        onCnclObj.onCancelId = `Order id in /${constants.LOG_ONCANCEL} and /${constants.LOG_CONFIRM} do not match`;
        console.log(
          `Order id in /${constants.LOG_ONCANCEL} and /${constants.LOG_CONFIRM} do not match`
        );
      }
    } catch (error) {
      // onCnclObj.onCancelId =
      //   "Order id in /${constants.LOG_ONCANCEL} and /${constants.LOG_ONCONFIRM} do not match";
      console.log(
        `!!Error while comparing order id in /${constants.LOG_ONCANCEL} and /${constants.LOG_ONCONFIRM}`,
        error
      );
    }

    try {
      console.log(
        `Comparing cancellation reason id in /${constants.LOG_ONCANCEL} and /${constants.LOG_CANCEL}`
      );
    
      if (dao.getValue("cnclRid") != on_cancel.fulfillments[0].tags.cancellation_reason_id) {
        onCnclObj.onCancelRID = `Cancellation Reason Id in /${constants.LOG_CANCEL} and /${constants.LOG_ONCANCEL} should be same`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing cancellation reason id in /${constants.LOG_CANCEL} and /${constants.LOG_ONCANCEL}`,
        error
      );
      // onCnclObj.onCancelRID =
      //   "Cancellation reason Id in /${constants.LOG_CANCEL} and /${constants.LOG_ONCANCEL} (inside tags) should be same";
    }

    try {
        console.log(
          `Checking awb no is required in ${constants.LOG_ONCANCEL} api`
        );
        if(on_cancel.hasOwnProperty("fulfillments")){
        if(dao.getValue("p2h2p") && !on_cancel.fulfillments[0].tags[ "AWB no"]){
           
            onCnclObj.awbNo=`AWB no is required for P2H2P shipments in ${constants.LOG_ONCANCEL} api`;
        }
      }
     } catch (error) {
        console.log(
          `Error fetching item descriptor code in ${constants.LOG_ONUPDATE} api`
        );
      }
      result.businessErrors=businessErr;
      return result;
    // dao.setValue("onCnclObj", onCnclObj);
  } 


module.exports = checkOnCancel;
