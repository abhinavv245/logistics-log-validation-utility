const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const { checkContext } = require("../../services/service");
const constants = require("../constants");
const validateSchema = require("../schemaValidation");

const checkTrack = (dirPath, msgIdSet) => {
  try {
    let data = fs.readFileSync(dirPath + `/${constants.LOG_TRACK}.json`);
    data = JSON.parse(data);
    return validate(
      "logistics",
      constants.LOG_TRACK,
      data,
      msgIdSet,
      dirPath
    );
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`!!File not found for /${constants.LOG_TRACK} API!`);
    } else {
      console.log(
        `!!Some error occurred while checking /${constants.LOG_TRACK} API`,
        err
      );
    }
  }
};
const validate = (domain, api, data, msgIdSet, dirPath) => {
  let result = {};

  let track = data;
 

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
      console.log(`Checking context for /${constants.LOG_TRACK}rack API`); //checking context
      res = checkContext(track.context, constants.LOG_TRACK);
      if (!res.valid) {
        Object.assign(businessErr, res.ERRORS);
      }
    } catch (error) {
      console.log(
        `!!Some error occurred while checking /${constants.LOG_TRACK} context`
      );
    }

    try {
      console.log(
        `Comparing city of /${constants.LOG_SEARCH} and /${constants.LOG_TRACK}`
      );
      if (!_.isEqual(dao.getValue("city"), track.context.city)) {
        businessErr.city = `City code mismatch in /${constants.LOG_SEARCH} and /${constants.LOG_TRACK}`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing city in /${constants.LOG_SEARCH} and /${constants.LOG_TRACK}`,
        error
      );
    }

    try {
      console.log(
        `Comparing timestamp of /${constants.LOG_TRACK} and /${constants.LOG_ONCONFIRM}`
      );
      if (_.gte(dao.getValue("tmpstmp"), track.context.timestamp)) {
        dao.setValue("trckTmpstmp", track.context.timestamp);
        businessErr.tmpstmp = `Timestamp for /${constants.LOG_ONCONFIRM} api cannot be greater than or equal to /${constants.LOG_TRACK} api`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing timestamp for /${constants.LOG_ONCONFIRM} and /${constants.LOG_TRACK} api`,
        error
      );
    }

    try {
      console.log(
        `Comparing transaction Ids of /search and /${constants.LOG_TRACK}`
      );
      if (!_.isEqual(dao.getValue("txnId"), track.context.transaction_id)) {
        businessErr.txnId = `Transaction Id should be same from /${constants.LOG_SEARCH} onwards`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing transaction ids for /select and /${constants.LOG_TRACK} api`,
        error
      );
    }

    try {
      console.log(`Checking Message Id of /${constants.LOG_TRACK}`);
      // if (!_.isEqual(msgId, onSelect.context.message_id)) {
      //   onSlctObj.msgId =
      //     "Message Id for /select and /on_select api should be same";
      // }

      if (msgIdSet.has(track.context.message_id)) {
        businessErr.msgId2 = `Message Id cannot be same for different sets of APIs`;
      }
      dao.setValue("msgId", track.context.message_id);
      // msgIdSet.add(onSelect.context.message_id);
    } catch (error) {
      console.log(
        `!!Error while checking message id for /${constants.LOG_TRACK}`
      );
    }

    track = track.message;

    try {
      console.log(
        `Checking Order Id in /${constants.LOG_TRACK} and /${constants.LOG_CONFIRM}`
      );
      if (track.order_id != dao.getValue("cnfrmOrdrId")) {
        console.log(
          `Order Id in /${constants.LOG_TRACK} and /${constants.LOG_CONFIRM} do not match`
        );
        businessErr.trackOrdrId = `Order Id in /${constants.LOG_TRACK} and /${constants.LOG_CONFIRM} do not match`;
      }
    } catch (error) {
      console.log(
        `Error while comparing order id in /${constants.LOG_TRACK} and /${constants.LOG_CONFIRM}`,
        error
      );
      // businessErr.trackOrdrId = "Order Id in /${constants.LOG_TRACK} and /${constants.LOG_ONCONFIRM} do not match";
    }
    // dao.setValue("businessErr", businessErr);
    result.businessErrors=businessErr;
    return result;
  } 


module.exports = checkTrack;
