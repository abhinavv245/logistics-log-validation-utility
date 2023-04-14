const config = require("../config/config");
const constants = require("../utils/constants");
const validateSchema = require("../utils/schemaValidation");
const utils = require("../utils/utils");
const _ = require("lodash");

const checkContext = (data, api) => {
  console.log(
    `Inside Context Validation Check....\n*** Validating context for ${api} ***`
  );

  if (!data) return;
  let errObj = {};

  //Transaction ID != Message ID
  if (data.transaction_id === data.message_id) {
    errObj.id_err = "transaction_id and message id can't be same";
  }
  //Context action == API
  if (data.action != api) {
    errObj.action_err = `context.action should be ${api}`;
  }

  //TTL as per the API contract
  if (data.ttl && data.ttl != constants.RET_CONTEXT_TTL) {
    {
      errObj.ttl_err = `ttl = ${constants.RET_CONTEXT_TTL} as per the API Contract`;
    }
  }

  //timestamp format check
  if (data.timestamp) {
    let date = data.timestamp;
    result = utils.timestampCheck(date);
    if (result && result.err === "FORMAT_ERR") {
      errObj.timestamp_err =
        "Timestamp not in RFC 3339 (YYYY-MM-DDTHH:MN:SS.MSSZ) Format";
    } else if (result && result.err === "INVLD_DT") {
      errObj.timestamp_err = "Timestamp should be in date-time format";
    }
  }

  if (_.isEmpty(errObj)) {
    const result = { valid: true, SUCCESS: "Context Valid" };
    console.log(result);
    return result;
  } else {
    const result = { valid: false, ERRORS: errObj };
    console.error(result);
    return result;
  }
};

module.exports = { checkContext };
