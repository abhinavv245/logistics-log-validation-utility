const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const { checkContext } = require("../../services/service");
const validateSchema = require("../schemaValidation");
const constants = require("../constants");

const checkOnTrack = (dirPath, msgIdSet) => {
  try {
    let data = fs.readFileSync(dirPath + `/${constants.LOG_ONTRACK}.json`);
    data = JSON.parse(data);
    return validate(
      "logistics",
      constants.LOG_ONTRACK,
      data,
      msgIdSet,
      dirPath
    );
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`!!File not found for /${constants.LOG_ONTRACK} API!`);
    } else {
      console.log(
        `!!Some error occurred while checking /${constants.LOG_ONTRACK} API`,
        err
      );
    }
  }
};
const validate = (domain, api, data, msgIdSet, dirPath) => {
  let result = {};

  let on_track = data;

 
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
    let businessErr = {};
    console.log(`Checking context for /${constants.LOG_ONTRACK} API`); //checking context
    try {
      res = checkContext(on_track.context, "on_track");
      if (!res.valid) {
        Object.assign(businessErr, res.ERRORS);
      }
    } catch (error) {
      console.log(
        `!!Some error occurred while checking /${constants.LOG_ONTRACK} context`,
        error
      );
    }

    try {
      console.log(
        `Comparing city of /${constants.LOG_SEARCH} and /${constants.LOG_ONTRACK}`
      );
      if (!_.isEqual(dao.getValue("city"), on_track.context.city)) {
        businessErr.cityErr = `City code mismatch in /${constants.LOG_SEARCH} and /${constants.LOG_ONTRACK}`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing city in /${constants.LOG_SEARCH} and /${constants.LOG_ONTRACK}`,
        error
      );
    }

    try {
      console.log(
        `Comparing timestamp of /${constants.LOG_ONTRACK} and /${constants.LOG_ONCONFIRM}`
      );
      if (_.gte(dao.getValue("tmpstmp"), on_track.context.timestamp)) {
        businessErr.tmpstmp1Err = `Timestamp for /${constants.LOG_ONCONFIRM} api cannot be greater than or equal to /${constants.LOG_ONTRACK} api`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing timestamp for /${constants.LOG_ONCONFIRM} and /${constants.LOG_ONTRACK} api`
      );
    }

    try {
      console.log(
        `Comparing timestamp of /${constants.LOG_TRACK} and /${constants.LOG_ONTRACK}`
      );
      if (_.gte(dao.getValue("trckTmpstmp"), on_track.context.timestamp)) {
        businessErr.tmpstmp2Err = `Timestamp for /${constants.LOG_TRACK} api cannot be greater than or equal to /${constants.LOG_ONTRACK} api`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing timestamp for /${constants.LOG_TRACK} and /${constants.LOG_ONTRACK} api`,
        error
      );
    }

    try {
      console.log(
        `Comparing transaction Ids of /${constants.LOG_SEARCH} and /${constants.LOG_ONTRACK}`
      );
      if (!_.isEqual(dao.getValue("txnId"), on_track.context.transaction_id)) {
        businessErr.txnIdErr = `Transaction Id should be same from /${constants.LOG_SEARCH} onwards`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing transaction ids for /${constants.LOG_SEARCH} and /${constants.LOG_ONTRACK} api`,
        error
      );
    }

    try {
      console.log(`Checking Message Id of /${constants.LOG_ONTRACK}`);
      if (!_.isEqual(dao.getValue("msgId"), on_track.context.message_id)) {
        businessErr.msgIdErr = `Message Id for /${constants.LOG_TRACK} and /${constants.LOG_ONTRACK} api should be same`;
      }

      // if (msgIdSet.has(status.context.message_id)) {
      //   statObj.msgId2 = "Message Id cannot be same for different sets of APIs";
      // }
      // msgId = status.context.message_id;
      msgIdSet.add(on_track.context.message_id);
    } catch (error) {
      console.log(
        `!!Error while checking message id for /${constants.LOG_ONTRACK}`,
        error
      );
    }

    on_track = on_track.message.tracking;

    try {
      console.log(
        `Checking tracking URL when status is active (/${constants.LOG_ONTRACK})`
      );
      if (on_track.status === "active" && !on_track.url) {
        businessErr.onTrackUrlErr =
          "Tracking url can't be null when status is active";
      }
    } catch (error) {
      console.log(
        `!!Error while checking tracking url in /${constants.LOG_ONTRACK}`,
        error
      );
      // businessErr.onTrackUrl =
      //   "Tracking url can't be null in case status is active";
    }

result.businessErrors=businessErr;
return result;
    // dao.setValue("businessErr", businessErr);
  }


module.exports = checkOnTrack;
