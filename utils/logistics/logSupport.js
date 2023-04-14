const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const { checkContext } = require("../../services/service");
const constants = require("../constants");
const validateSchema = require("../schemaValidation");

const checkSupport = (dirPath, msgIdSet) => {
  try {
    let data = fs.readFileSync(dirPath + `/${constants.LOG_SUPPORT}.json`);
    data = JSON.parse(data);
    return validate(
      "logistics",
      constants.LOG_SUPPORT,
      data,
      msgIdSet,
      dirPath
    );
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`!!File not found for /${constants.LOG_SUPPORT} API!`);
    } else {
      console.log(
        `!!Some error occurred while checking /${constants.LOG_SUPPORT} API`,
        err
      );
    }
  }
};
const validate = (domain, api, data, msgIdSet, dirPath) => {
  let result = {};

  let support = data;

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
    console.log(`Checking context for /${constants.LOG_SUPPORT} API`); //checking context
    res = checkContext(support.context, constants.LOG_SUPPORT);
    if (!res.valid) {
      Object.assign(businessErr, res.ERRORS);
    }
  } catch (error) {
    console.log(
      `!!Some error occurred while checking /${constants.LOG_SUPPORT} context`,
      error
    );
  }

  try {
    console.log(
      `Comparing city of ${constants.LOG_SEARCH} and /${constants.LOG_SUPPORT}`
    );
    if (!_.isEqual(dao.getValue("city"), support.context.city)) {
      businessErr.cityErr = `City code mismatch in ${constants.LOG_SEARCH} and /${constants.LOG_SUPPORT}`;
    }
  } catch (error) {
    console.log(
      `Error while comparing city in ${constants.LOG_SEARCH} and /${constants.LOG_SUPPORT}`,
      error
    );
  }
  console.log(
    `Comparing timestamp of /${constants.LOG_SUPPORT} and /${constants.LOG_ONCONFIRM}`
  );

  try {
    if (_.gte(dao.getValue("tmpstmp"), support.context.timestamp)) {
      businessErr.tmpstmpErr = `Timestamp for /${constants.LOG_ONCONFIRM} api cannot be greater than or equal to /${constants.LOG_SUPPORT} api`;
    }
    dao.setValue("sprtTmpstmp", support.context.timestamp);
  } catch (error) {
    console.log(
      `!!Error while comparing timestamp for /${constants.LOG_ONCONFIRM} and /${constants.LOG_SUPPORT} api`,
      error
    );
  }
  try {
    console.log(
      `Comparing transaction Ids of /${constants.LOG_SEARCH} and /${constants.LOG_SUPPORT}`
    );
    if (!_.isEqual(dao.getValue("txnId"), support.context.transaction_id)) {
      businessErr.txnIdErr = `Transaction Id should be same from /${constants.LOG_SEARCH} onwards`;
    }
  } catch (error) {
    console.log(
      `!!Error while comparing transaction ids for /${constants.LOG_SEARCH} and /${constants.LOG_SUPPORT} api`,
      error
    );
  }
  try {
    console.log(`Checking Message Id of /${constants.LOG_SUPPORT}`);
    // if (!_.isEqual(msgId, onSelect.context.message_id)) {
    //   onSlctObj.msgId =
    //     "Message Id for /${constants.LOG_SELECT} and /on_select api should be same";
    // }
    if (msgIdSet.has(support.context.message_id)) {
      businessErr.msgId2Err = `Message Id cannot be same for different sets of APIs`;
    }
    dao.setValue("msgId", support.context.message_id);
    // msgIdSet.add(onSelect.context.message_id);
  } catch (error) {
    console.log(
      `!!Error while checking message id for /${constants.LOG_SUPPORT}`,
      error
    );
  }
  support = support.message;

  try {
    console.log(`Checking ref_id in /${constants.LOG_SUPPORT}`);
    if (!_.isEqual(dao.getValue("txnId"), support.ref_id)) {
      businessErr.refIdErr = `Transaction Id should be provided as ref_id`;
    }
  } catch (error) {
    businessErr.refIdErr = `Transaction Id should be provided as ref_id`;
    console.log(
      `!!Error while checking ref_id in /${constants.LOG_SUPPORT}`,
      error
    );
  }

  result.businessErrors = businessErr;
  return result;
  // dao.setValue("businessErr", businessErr);
};

module.exports = checkSupport;
