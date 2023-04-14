const fs = require("fs");
const _ = require("lodash");
const { checkContext } = require("../../services/service");
const dao = require("../../dao/dao");
const validateSchema = require("../schemaValidation");
const constants = require("../constants");

const checkOnInit = (dirPath, msgIdSet) => {
  try {
    let data = fs.readFileSync(dirPath + `/${constants.LOG_ONINIT}.json`);
    data = JSON.parse(data);
    return validate("logistics", constants.LOG_ONINIT, data, msgIdSet, dirPath);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`!!File not found for /${constants.LOG_ONINIT} API!`);
    } else {
      console.log(
        `!!Some error occurred while checking /${constants.LOG_ONINIT} API`,
        err
      );
    }
  }
};
const validate = (domain, api, data, msgIdSet, dirPath) => {
  let result = {};
  let on_init = data;
  try {
    let onsearch = fs.readFileSync(dirPath + `/${constants.LOG_ONSEARCH}.json`);
    onsearch = JSON.parse(onsearch);

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
    console.log(`Checking context for /${constants.LOG_ONINIT} API`); //checking context
    try {
      res = checkContext(on_init.context, constants.LOG_ONINIT);
      if (!res.valid) {
        Object.assign(businessErr, res.ERRORS);
      }
    } catch (error) {
      console.log(
        `!!Some error occurred while checking /${constants.LOG_ONINIT} context`,
        error
      );
    }

    try {
      console.log(
        `Comparing city of ${constants.LOG_SEARCH} & ${constants.LOG_ONINIT}`
      );
      if (!_.isEqual(dao.getValue("city"), on_init.context.city)) {
        businessErr.cityErr = `City code mismatch in ${constants.LOG_SEARCH} & ${constants.LOG_ONINIT}`;
      }
    } catch (error) {
      console.log(
        `Error while comparing city in ${constants.LOG_SEARCH} & ${constants.LOG_ONINIT}`,
        error
      );
    }

    try {
      console.log(
        `Comparing timestamp of ${constants.LOG_INIT} & ${constants.LOG_ONINIT}`
      );
      if (_.gte(dao.getValue("tmpstmp"), on_init.context.timestamp)) {
        businessErr.tmpstmpErr = `Timestamp for ${constants.LOG_INIT} api cannot be greater than or equal to ${constants.LOG_ONINIT} api`;
      }
      dao.setValue("tmpstmp", on_init.context.timestamp);
    } catch (error) {
      console.log(
        `!!Error while comparing timestamp for /${constants.LOG_INIT} and /${constants.LOG_ONINIT} api`,
        error
      );
    }

    try {
      console.log(
        `Comparing transaction Ids of /${constants.LOG_SEARCH} & /${constants.LOG_ONINIT}`
      );
      if (!_.isEqual(dao.getValue("txnId"), on_init.context.transaction_id)) {
        businessErr.txnIdErr = `Transaction Id should be same from /${constants.LOG_SEARCH} onwards`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing transaction ids for /${constants.LOG_SEARCH} & /${constants.LOG_ONINIT} api`,
        error
      );
    }

    try {
      console.log(
        `Comparing Message Ids of /${constants.LOG_INIT} and /${constants.LOG_ONINIT}`
      );
      if (!_.isEqual(dao.getValue("msgId"), on_init.context.message_id)) {
        businessErr.msgIdErr = `Message Ids for /${constants.LOG_INIT} and /${constants.LOG_ONINIT} api should be same`;
      }

      // if (msgIdSet.has(on_init.context.message_id)) {
      //   businessErr.msgId2Err =
      //     "Message Id cannot be same for different sets of APIs";
      // }

      msgIdSet.add(on_init.context.message_id);
    } catch (error) {
      console.log(
        `!!Error while checking message id for /${constants.LOG_INIT}`,
        error
      );
    }

    on_init = on_init.message.order;
    onsearch = onsearch.message.catalog;

    try {
      console.log(`Comparing order quote price and break up  in ${api}`);
      if (on_init.hasOwnProperty("quote")) {
        if (on_init.quote.price.value !== on_init.quote.breakup[0].price.value)
          businessErr.quotePriceErr = `Quote price does not match the breakup total in ${api}`;
      }
    } catch (err) {
      console.log(`!!Error fetching order quote price in ${api}`, err);
    }

    try {
      console.log(`Checking provider's location  in /${constants.LOG_ONINIT}`);
      onsearch["bpp/providers"].forEach((prov) => {
        if (prov.id === on_init.provider.id) {
          if (prov.hasOwnProperty("locations")) {
            if (!on_init.provider.hasOwnProperty("locations"))
              businessErr.locationErr = `Provider location missing in ${constants.LOG_ONINIT} api`;
          }
        }
      });
    } catch (error) {
      console.log(`Error fetching the provider's location`, error);
    }

    result.businessErrors = businessErr;
    return result;
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`!!File not found for /${constants.LOG_ONSEARCH} API!`);
    } else {
      console.log(
        `!!Some error occurred while checking /${constants.LOG_ONSEARCH} API`,
        err
      );
    }
  }
};

module.exports = checkOnInit;
