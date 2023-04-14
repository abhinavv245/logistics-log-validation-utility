const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const { checkContext } = require("../../services/service");
const validateSchema = require("../schemaValidation");
const utils = require("../utils");
const constants = require("../constants");

const checkOnConfirm = (dirPath, msgIdSet) => {
  let data = fs.readFileSync(dirPath + `/${constants.LOG_ONCONFIRM}.json`);
  data = JSON.parse(data);
  return validate("logistics", constants.LOG_ONCONFIRM, data, msgIdSet, dirPath);
};

const validate = (domain, api, data, msgIdSet, dirPath) => {
  let result = {};
  let on_confirm = data;

  try {
   
    let confirm = fs.readFileSync(dirPath + `/${constants.LOG_CONFIRM}.json`);
    confirm = JSON.parse(confirm);
   

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
      console.log(`Checking context for /${constants.LOG_ONCONFIRM} API`); //checking context
      res = checkContext(on_confirm.context, constants.LOG_ONCONFIRM);
      if (!res.valid) {
        Object.assign(businessErr, res.ERRORS);
      }
    } catch (error) {
      console.log(
        `!!Some error occurred while checking /${constants.LOG_ONCONFIRM} context`,
        error
      );
    }

    try {
      console.log(
        `Comparing city of /${constants.LOG_SEARCH} and /${constants.LOG_ONCONFIRM}`
      );
      if (!_.isEqual(dao.getValue("city"), on_confirm.context.city)) {
        businessErr.cityErr = `City code mismatch in /${constants.LOG_SEARCH} and /${constants.LOG_ONCONFIRM}`;
      }
    } catch (error) {
      console.log(
        `Error while comparing city in /${constants.LOG_SEARCH} and /${constants.LOG_ONCONFIRM}`,
        error
      );
    }

    try {
      console.log(
        `Comparing timestamp of /${constants.LOG_CONFIRM} and /${constants.LOG_ONCONFIRM}`
      );
      if (_.gte(dao.getValue("tmpstmp"), on_confirm.context.timestamp)) {
        businessErr.tmpstmpErr = `Timestamp for /${constants.LOG_CONFIRM} api cannot be greater than or equal to /${constants.LOG_ONCONFIRM} api`;
      }
      tmpstmp = on_confirm.context.timestamp;
      dao.setValue("tmpstmp", tmpstmp);
    } catch (error) {
      console.log(
        `Error while comparing timestamp for /${constants.LOG_CONFIRM} and /${constants.LOG_ONCONFIRM} api`,
        error
      );
    }

    try {
      console.log(
        `Comparing transaction Ids of /${constants.LOG_SEARCH} and /${constants.LOG_ONCONFIRM}`
      );
      if (
        !_.isEqual(dao.getValue("txnId"), on_confirm.context.transaction_id)
      ) {
        businessErr.txnIdErr = `Transaction Id should be same from /${constants.LOG_SEARCH} onwards`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing transaction ids for /${constants.LOG_SEARCH} and /${constants.LOG_ONCONFIRM} api`,
        error
      );
    }

    try {
      console.log(
        `Comparing Message Ids of /${constants.LOG_CONFIRM} and /${constants.LOG_ONCONFIRM}`
      );
      if (!_.isEqual(dao.getValue("msgId"), on_confirm.context.message_id)) {
        businessErr.msgIdErr = `Message Ids for /${constants.LOG_CONFIRM} and /${constants.LOG_ONCONFIRM} apis should be same`;
      }
      // if (msgIdSet.has(confirm.context.message_id)) {
      //   cnfrmObj.msgId2 = "Message Id cannot be same for different sets of APIs";
      // }
      // msgId = confirm.context.message_id;
      msgIdSet.add(on_confirm.context.message_id);
    } catch (error) {
      console.log(
        `Error while checking message id for /${constants.LOG_ONCONFIRM}`,
        error
      );
    }

    on_confirm = on_confirm.message.order;
    confirm = confirm.message.order;
  

    try {
      console.log(
        `Comparing order ids in /${constants.LOG_CONFIRM} and /${constants.LOG_ONCONFIRM}`
      );
      if (dao.getValue("cnfrmOrdrId") != on_confirm.id) {
        businessErr.orderIDErr = `Order Id mismatches in /${constants.LOG_CONFIRM} and /${constants.LOG_ONCONFIRM}`;
      }
    } catch (error) {
      console.log(
        `!!Error while trying to fetch order ids in /${constants.LOG_ONCONFIRM}`,
        error
      );
    }
    try {
      console.log(
        `checking created_at and updated_at timestamp in /${constants.LOG_ONCONFIRM}`
      );
      const cnfrmOrdrCrtd = dao.getValue("ordrCrtd");
      const cnfrmOrdrUpdtd = dao.getValue("ordrUpdtd");
      if (
        on_confirm.state.toLowerCase() === "created" ||
        on_confirm.state.toLowerCase() === "accepted"
      ) {
        if (
          cnfrmOrdrCrtd &&
          (!on_confirm.created_at || on_confirm.created_at != cnfrmOrdrCrtd)
        ) {
          businessErr.crtdtmstmpErr = `order.created_at timestamp mismatches in /${constants.LOG_CONFIRM} and /${constants.LOG_ONCONFIRM}`;
        }

       
      }

      // if (on_confirm.state.toLowerCase() === "accepted") {
      //   if (
      //     cnfrmOrdrUpdtd &&
      //     (!on_confirm.updated_at ||
      //       _.gt(cnfrmOrdrUpdtd, on_confirm.updated_at))
      //   ) {
      //     businessErr.updtdtmstmp = `order.updated_at timestamp can't be same when order state changes`;
      //   }
      // }
    } catch (error) {
      console.log(
        `!!Error while checking order timestamps in /${constants.LOG_ONCONFIRM}`,
        error
      );
    }
    try {
        console.log(
          `Comparing billing object in /${constants.LOG_INIT} and /${constants.LOG_ONCONFIRM}`
        );
        const billing = dao.getValue("billing");
        if (!_.isEqual(billing, on_confirm.billing)) {
          businessErr.billErr = `Billing object mismatches in /${constants.LOG_INIT} and /${constants.LOG_ONCONFIRM}`;
        }
      } catch (error) {
        console.log(
          `!!Error while comparing billing object in /${constants.LOG_INIT} and /${constants.LOG_ONCONFIRM}`
        );
      }
    // dao.setValue("onCnfrmOrdrId", on_confirm.id);
    try {
      console.log(`Checking provider locations in ${constants.LOG_ONCONFIRM}`);
      if (confirm.hasOwnProperty("provider").hasOwnProperty("locations")) {
        if (!on_confirm.hasOwnProperty("provider").hasOwnProperty("locations"))
          businessErr.provLocationErr = `Provider location is missing in ${constants.LOG_ONCONFIRM}`;
      }
    } catch (error) {
      console.log(
        `!!Error while checking order provider locations in /${constants.LOG_ONCONFIRM}`,
        error
      );
    }

    try {
      console.log(
        `Checking if start and end required in ${constants.LOG_ONCONFIRM}`
      );
      if (confirm.hasOwnProperty("fulfillments")) {
        confirm.fulfillments.forEach((fulfillment) => {
          if (fulfillment.tags["@ondc/org/order_ready_to_ship"] === "yes") {
            if (on_confirm.hasOwnProperty("fulfillments")) {
              if (!on_confirm.fulfillments[0].start)
                businessErr.startErr = `start attribute is missing in ${constants.LOG_ONCONFIRM} api`;
              if (!on_confirm.fulfillments[0].end)
                businessErr.endErr = `end attribute is missing in ${constants.LOG_ONCONFIRM} api`;
            }
          }
        });
      }
    } catch (error) {
      console.log(
        `!!Error while checking order provider locations in /${constants.LOG_ONCONFIRM}`,
        error
      );
    }

    result.businessErrors=businessErr;
    return result;
    // dao.setValue("businessErr", businessErr);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`!!File not found for /${constants.LOG_ONCONFIRM} API!`);
    } else {
      console.log(
        `!!Some error occurred while checking /${constants.LOG_ONCONFIRM} API`,
        err
      );
    }
  }
};
module.exports = checkOnConfirm;
