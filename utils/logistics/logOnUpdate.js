const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const { checkContext } = require("../../services/service");
const validateSchema = require("../schemaValidation");
const utils = require("../utils");
const constants = require("../constants");
const { LOG_ONUPDATE } = require("../constants");

const checkOnUpdate = (dirPath, msgIdSet) => {
  try{
  let data = fs.readFileSync(dirPath + `/${constants.LOG_ONUPDATE}.json`);
  data = JSON.parse(data);
  return validate("logistics", constants.LOG_ONUPDATE, data, msgIdSet, dirPath);
  }catch (err) {
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
  let on_update = data;
  let businessErr = {};

  try {
   
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
      console.log(`Checking context for /${constants.LOG_ONUPDATE} API`); //checking context
      res = checkContext(on_update.context, constants.LOG_ONUPDATE);
      if (!res.valid) {
        Object.assign(businessErr, res.ERRORS);
      }
    } catch (error) {
      console.log(
        `!!Some error occurred while checking /${constants.LOG_ONUPDATE} context`,
        error
      );
    }

    try {
      console.log(
        `Comparing city of /${constants.LOG_SEARCH} and /${constants.LOG_ONUPDATE}`
      );
      if (!_.isEqual(dao.getValue("city"), on_update.context.city)) {
        businessErr.cityErr = `City code mismatch in /${constants.LOG_SEARCH} and /${constants.LOG_ONUPDATE}`;
      }
    } catch (error) {
      console.log(
        `Error while comparing city in /${constants.LOG_SEARCH} and /${constants.LOG_ONUPDATE}`,
        error
      );
    }

    try {
      console.log(
        `Comparing timestamp of /${constants.LOG_UPDATE} and /${constants.LOG_ONUPDATE}`
      );
      if (_.gte(dao.getValue("updtTmpstmp"), on_update.context.timestamp)) {
        businessErr.tmpstmpErr = `Timestamp for /${constants.LOG_UPDATE} api cannot be greater than or equal to /${constants.LOG_ONUPDATE} api`;
      }
    } catch (error) {
      console.log(
        `Error while comparing timestamp for /${constants.LOG_UPDATE} and /${constants.LOG_ONUPDATE} api`,
        error
      );
    }

    try {
      console.log(
        `Comparing transaction Ids of /${constants.LOG_SEARCH} and /${constants.LOG_ONUPDATE}`
      );
      if (!_.isEqual(dao.getValue("txnId"), on_update.context.transaction_id)) {
        businessErr.txnIdErr = `Transaction Id should be same from /${constants.LOG_SEARCH} onwards`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing transaction ids for /${constants.LOG_SEARCH} and /${constants.LOG_ONUPDATE} API`,
        error
      );
    }

    try {
      console.log(
        `Comparing Message Ids of /${constants.LOG_UPDATE} and /${constants.LOG_ONUPDATE}`
      );
      if (!_.isEqual(dao.getValue("msgId"), on_update.context.message_id)) {
        businessErr.msgIdErr = `Message Ids for /${constants.LOG_UPDATE} and /${constants.LOG_ONUPDATE} apis should be same`;
      }
      // if (msgIdSet.has(confirm.context.message_id)) {
      //   cnfrmObj.msgId2 = "Message Id cannot be same for different sets of APIs";
      // }
      // msgId = confirm.context.message_id;
      msgIdSet.add(on_update.context.message_id);
    } catch (error) {
      console.log(
        `Error while checking message id for /${constants.LOG_ONUPDATE}`,
        error
      );
    }

    on_update = on_update.message.order;

    try {
        console.log(
          `Checking awb no is required in ${constants.LOG_ONUPDATE} api`
        );
        if(on_update.hasOwnProperty("fulfillments")){
        if(dao.getValue("p2h2p") && !on_update.fulfillments[0]["@ondc/org/awb_no"]){
           
            businessErr.awbNoErr=`AWB no is required for P2H2P shipments in ${constants.LOG_ONUPDATE} api`;
        }
      }
     } catch (error) {
        console.log(
          `Error fetching AWB no in ${constants.LOG_ONUPDATE} api`
        );
      }
    try {
      console.log(
        `Comparing order ids in /${constants.LOG_CONFIRM} and /${constants.LOG_ONUPDATE}`
      );
      if (dao.getValue("cnfrmOrdrId") != on_update.id) {
        businessErr.orderIDErr = `Order Id mismatches in /${constants.LOG_CONFIRM} and /${constants.LOG_ONUPDATE}`;
      }
    } catch (error) {
      console.log(
        `!!Error while trying to fetch order ids in /${constants.LOG_ONUPDATE}`,
        error
      );
    }

result.businessErrors=businessErr;
return result;
   
    // dao.setValue("businessErr", businessErr);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`!!File not found for /${constants.LOG_ONUPDATE} API!`);
    } else {
      console.log(
        `!!Some error occurred while checking /${constants.LOG_ONUPDATE} API`,
        err
      );
    }
  }
};

module.exports = checkOnUpdate;
