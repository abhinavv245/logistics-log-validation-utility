const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const { checkContext } = require("../../services/service");
const { LOG_CONFIRM } = require("../constants");
const constants = require("../constants");
const validateSchema = require("../schemaValidation");

const checkConfirm = (dirPath, msgIdSet) => {
  let data = fs.readFileSync(dirPath + `/${constants.LOG_CONFIRM}.json`);
  data = JSON.parse(data);
  return validate("logistics", constants.LOG_CONFIRM, data, msgIdSet, dirPath);
};
const validate = (domain, api, data, msgIdSet, dirPath) => {
  let result = {};
  let confirm = data;
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

    try {
      console.log(`Checking context for /${constants.LOG_CONFIRM} API`); //checking context
      res = checkContext(confirm.context, api);
      if (!res.valid) {
        Object.assign(businessErr, res.ERRORS);
      }
    } catch (error) {
      console.log(
        `!!Some error occurred while checking /${constants.LOG_CONFIRM} context`,
        error
      );
    }

    try {
      console.log(
        `Comparing city of /${constants.LOG_SEARCH} and /${constants.LOG_CONFIRM}`
      );
      if (!_.isEqual(dao.getValue("city"), confirm.context.city)) {
        businessErr.cityErr = `City code mismatch in /${constants.LOG_SEARCH} and /${constants.LOG_CONFIRM}`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing city in /${constants.LOG_SEARCH} and /${constants.LOG_CONFIRM}`,
        error
      );
    }

    try {
      console.log(
        `Comparing timestamp of /${constants.LOG_ONINIT} and /${constants.LOG_CONFIRM}`
      );
      if (_.gte(dao.getValue("tmpstmp"), confirm.context.timestamp)) {
        businessErr.tmpstmpErr = `Timestamp for /${constants.LOG_ONINIT} api cannot be greater than or equal to /${constants.LOG_CONFIRM} api`;
      }
      dao.setValue("tmpstmp", confirm.context.timestamp);
    } catch (error) {
      console.log(
        `!!Error while comparing timestamp for /${constants.LOG_ONINIT} and /${constants.LOG_CONFIRM} api`,
        error
      );
    }

    try {
      console.log(
        `Comparing transaction Ids of /${constants.LOG_SEARCH} and /${constants.LOG_CONFIRM}`
      );
      if (!_.isEqual(dao.getValue("txnId"), confirm.context.transaction_id)) {
        businessErr.txnIdErr = `Transaction Id should be same from /${constants.LOG_SEARCH} onwards`;
      }
    } catch (error) {
      console.log(
        `Error while comparing transaction ids for /${constants.LOG_SEARCH} and /${constants.LOG_CONFIRM} api`,
        error
      );
    }

    try {
      console.log(`Checking Message Id of /${constants.LOG_CONFIRM}`);
      // if (!_.isEqual(msgId, on_init.context.message_id)) {
      //   onInitObj.msgId = "Message Ids for /init and /on_init api should be same";
      // }

      if (msgIdSet.has(confirm.context.message_id)) {
        businessErr.msgId2Err =
          "Message Id cannot be same for different sets of APIs";
      }
      dao.setValue("msgId", confirm.context.message_id);
      // msgIdSet.add(onSelect.context.message_id);
    } catch (error) {
      console.log(
        `!!Error while checking message id for /${constants.LOG_CONFIRM}`,
        error
      );
    }

    confirm = confirm.message.order;
    onsearch = onsearch.message.catalog;

    const cnfrmOrdrId = confirm.id;
    dao.setValue("cnfrmOrdrId", cnfrmOrdrId);

    try {
      console.log(`Checking provider's location  in /${constants.LOG_CONFIRM}`);
      onsearch["bpp/providers"].forEach((prov) => {
        if (prov.id === confirm.provider.id) {
          if (prov.hasOwnProperty("locations")) {
            if (!confirm.provider.hasOwnProperty("locations"))
              businessErr.locationErr = `Provider location missing in ${constants.LOG_CONFIRM} api`;
          }
        }
      });
    } catch (error) {
      console.log(`Error fetching the provider's location`, error);
    }

    

    try {
      console.log(
        `Checking PCC code in case order is ready to ship in ${constants.LOG_CONFIRM} api`
      );

      if (confirm.hasOwnProperty("fulfillments")) {
        confirm.fulfillments.forEach((fulfillment) => {
          if (fulfillment.tags["@ondc/org/order_ready_to_ship"] === "yes") {
            if (!fulfillment.start.instructions["short_desc"]) {
              businessErr.pickUpCodeErr = `Pickup Code (PCC) mandatory for ready to ship items in ${constants.LOG_CONFIRM} api`;
            }
          }else{
            if (!fulfillment.end.instructions["short_desc"]) {
                businessErr.delCodeErr = `Delivery Code (Code) required in ${constants.LOG_CONFIRM} api`;
              }
          }
        });
      }
    } catch (error) {
      console.log(
        `Error fetching order fulfillment tags in ${constants.LOG_CONFIRM} api`
      );
    }

    try {
      console.log(`Checking order state in /${constants.LOG_CONFIRM}`);
      if (confirm.state.toLowerCase() != "created") {
        businessErr.stateErr = `Default order state should be used in /${constants.LOG_CONFIRM}`;
      }
    } catch (error) {
      console.log(
        `!!Error while checking order state in /${constants.LOG_CONFIRM}`,
        error
      );
    }

 

   

    try {
      console.log(
        `Comparing billing object in /${constants.LOG_INIT} and /${constants.LOG_CONFIRM}`
      );
      const billing = dao.getValue("billing");
      if (!_.isEqual(billing, confirm.billing)) {
        businessErr.billErr = `Billing object mismatches in /${constants.LOG_INIT} and /${constants.LOG_CONFIRM}`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing billing object in /${constants.LOG_INIT} and /${constants.LOG_CONFIRM}`
      );
    }

  

    try {
      console.log(`Checking created at and updated at timestamps in /${constants.LOG_CONFIRM}`);

      if (
        !confirm.hasOwnProperty("created_at") ||
        !confirm.hasOwnProperty("updated_at")
      ) {
        businessErr.ordertmpstmp = `order created and updated timestamps are mandatory in /${constants.LOG_CONFIRM}`;
      } else {
        if (!_.isEqual(confirm.created_at, dao.getValue("tmpstmp"))) {
          businessErr.orderCrtdErr = `order.created_at timestamp should match context.timestamp`;
        } else {
          dao.setValue("ordrcrtdtmpstmp", confirm.created_at);
        }

        if (!_.isEqual(confirm.created_at, confirm.updated_at)) {
          businessErr.ordrupdtdErr = `order.updated_at timestamp should match order.created_at timestamp`;
        } else {
          dao.setValue("ordrupdtdtmpstmp", confirm.updated_at);
        }
      }
    } catch (error) {
      console.log(
        `!!Error while checking payment object in /${constants.LOG_CONFIRM}`,
        error
      );
    }

    try {
      console.log(`storing payment object in /${constants.LOG_CONFIRM}`);
      dao.setValue("cnfrmpymnt", confirm.payment);
    } catch (error) {
      console.log(
        `!!Error while storing payment object in /${constants.LOG_CONFIRM}`,
        error
      );
    }

  

    
    try {
      console.log("storing order created and updated timestamps");
      if (confirm.created_at) dao.setValue("ordrCrtd", confirm.created_at);

      if (confirm.updated_at) dao.setValue("ordrUpdtd", confirm.updated_at);
    } catch (error) {
      console.log(
        `!!Error while storing order created and updated timestamps in /${constants.LOG_CONFIRM}`
      );
    }


    result.businessErrors=businessErr;
    return result;
    // dao.setValue("businessErr", businessErr);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`!!File not found for /${constants.LOG_CONFIRM} API!`);
    } else {
      console.log(
        `!!Some error occurred while checking /${constants.LOG_CONFIRM} API`,
        err
      );
    }
  }
};

module.exports = checkConfirm;
