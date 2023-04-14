const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const { checkContext } = require("../../services/service");
const utils = require("../utils");
const validateSchema = require("../schemaValidation");
const constants = require("../constants");

const checkUpdate = (dirPath, msgIdSet) => {
  try{
  let data = fs.readFileSync(dirPath + `/${constants.LOG_UPDATE}.json`);
  data = JSON.parse(data);
  return validate("logistics", constants.LOG_UPDATE, data, msgIdSet, dirPath);
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
  let update = data;
  let updtObj = {};
  let itemsUpdt = {};

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
      console.log(`Checking context for /${constants.LOG_UPDATE} API`); //checking context
      res = checkContext(update.context, api);
      if (!res.valid) {
        Object.assign(businessErr, res.ERRORS);
      }
    } catch (error) {
      console.log(
        `!!Some error occurred while checking /${constants.LOG_UPDATE} context`,
        error
      );
    }

    try {
      console.log(
        `Comparing city of /${constants.LOG_SEARCH} and /${constants.LOG_UPDATE}`
      );
      if (!_.isEqual(dao.getValue("city"), update.context.city)) {
        businessErr.cityErr = `City code mismatch in /${constants.LOG_SEARCH} and /${constants.LOG_UPDATE}`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing city in /${constants.LOG_SEARCH} and /${constants.LOG_UPDATE}`,
        error
      );
    }

    try {
      console.log(
        `Comparing timestamp of /${constants.LOG_UPDATE} and /${constants.LOG_ONCONFIRM}`
      );
      if (_.gte(dao.getValue("tmpstmp"), update.context.timestamp)) {
        businessErr.tmpstmpErr = `Timestamp for /${constants.LOG_ONCONFIRM} api cannot be greater than or equal to /${constants.LOG_UPDATE} api`;
      }
      dao.setValue("updtTmpstmp", update.context.timestamp);
    } catch (error) {
      console.log(
        `Error while comparing timestamp for /${constants.LOG_ONCONFIRM} and /${constants.LOG_UPDATE} api`,
        error
      );
    }

    try {
      console.log(
        `Comparing transaction Ids of /${constants.LOG_SEARCH} and /${constants.LOG_UPDATE}`
      );
      if (!_.isEqual(dao.getValue("txnId"), update.context.transaction_id)) {
        businessErr.txnIdErr = `Transaction Id should be same from /${constants.LOG_SEARCH} onwards`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing transaction ids for /${constants.LOG_SEARCH} and /${constants.LOG_UPDATE} api`
      );
    }
    try {
      console.log(`Checking Message Id of /${constants.LOG_UPDATE}`);
      // if (!_.isEqual(msgId, onSelect.context.message_id)) {
      //   onSlctObj.msgId =
      //     "Message Id for ${constants.LOG_SELECT} and /on_select api should be same";
      // }

      if (msgIdSet.has(update.context.message_id)) {
        businessErr.msgId2Err = `Message Id cannot be same for different sets of APIs`;
      }
      dao.setValue("msgId", update.context.message_id);
      // msgIdSet.add(onSelect.context.message_id);
    } catch (error) {
      console.log(
        `!!Error while checking message id for /${constants.LOG_UPDATE}`
      );
    }
    try {
      console.log(
        `Comparing timestamp pf context and updated_at  in ${constants.LOG_UPDATE} api`
      );
      if (update.message.order.hasOwnProperty("updated_at")) {
        if (
          !_.isEqual(
            update.context.timestamp,
            update.message.order["updated_at"]
          )
        ) {
          businessErr.updtdTimestampErr = `updated_at timestamp should match the context timestamp in ${constants.LOG_UPDATE}`;
        }
      }
    } catch (error) {
      console.log(
        `!!Error while fetching updated_at timestamp in /${constants.LOG_UPDATE}`,
        error
      );
    }
    update = update.message.order;

    try {
      console.log(`Saving items update_type in /${constants.LOG_UPDATE}`);
      update.items.forEach((item, i) => {
        if (item.hasOwnProperty("tags")) {
          if (
            item.tags.update_type === "return" ||
            item.tags.update_type === "cancel"
          ) {
            itemsUpdt[item.id] = [item.quantity.count, item.tags.update_type];
          } else {
            businessErr.updtTypeErr = `items[${i}].tags.update_type can't be ${item.tags.update_type}`;
          }
        }
      });
      dao.setValue("itemsUpdt", itemsUpdt);
    } catch (error) {
      console.log(
        `!!Error while saving items update_type in /${constants.LOG_UPDATE}`,
        error
      );
    }

    try {
      console.log(
        `Checking start attribute if order is ready to ship in ${constants.LOG_UPDATE} api`
      );
      if (update.hasOwnProperty("fulfillments")) {
        update.fulfillments.forEach((fulfillment) => {
          if (fulfillment.tags["@ondc/org/order_ready_to_ship"] === "yes") {
            if (!fulfillment.start)
              businessErr.startErr = `start attribute required for ready to ship fulfillment in ${constants.LOG_UPDATE} api`;
          }
        });
      }
    } catch (error) {
      console.log(
        `!!Error while fetching fulfillments in /${constants.LOG_UPDATE}`,
        error
      );
    }

    result.businessErrors=businessErr;
    return result;
    // dao.setValue("businessErr", businessErr);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`!!File not found for /${constants.LOG_UPDATE} API!`);
    } else {
      console.log(
        `!!Some error occurred while checking /${constants.LOG_UPDATE} API`,
        err
      );
    }
  }
};

module.exports = checkUpdate;
