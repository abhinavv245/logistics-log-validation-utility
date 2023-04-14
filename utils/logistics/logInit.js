const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const { checkContext } = require("../../services/service");
const { LOG_INIT, LOG_ONSEARCH } = require("../constants");
const constants = require("../constants");
const validateSchema = require("../schemaValidation");
const { bpp_fulfillments } = require("../utils");

const checkInit = (dirPath, msgIdSet) => {
  let data = fs.readFileSync(dirPath + `/${constants.LOG_INIT}.json`);
  data = JSON.parse(data);
  return validate("logistics", constants.LOG_INIT, data, msgIdSet, dirPath);
};
const validate = (domain, api, data, msgIdSet, dirPath) => {
  let result = {};
  let init = data;
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
      console.log(`Checking context for /${constants.LOG_INIT} API`); //checking context
      res = checkContext(init.context, api);
      if (!res.valid) {
        Object.assign(businessErr, res.ERRORS);
      }
    } catch (error) {
      console.log(
        `!!Some error occurred while checking /${constants.LOG_INIT} context`,
        error
      );
    }

    try {
      console.log(
        `Comparing city of /${constants.LOG_SEARCH} and /${constants.LOG_INIT}`
      );

      if (!_.isEqual(dao.getValue("city"), init.context.city)) {
        businessErr.cityErr = `City code mismatch in /${constants.LOG_SEARCH} and /${constants.LOG_INIT}`;
      }
    } catch (error) {
      console.log(
        `Error while comparing city in /${constants.LOG_SEARCH} and /${constants.LOG_INIT}`,
        error
      );
    }

    try {
      console.log(
        `Comparing timestamp of /${constants.LOG_ONSEARCH} and /${constants.LOG_INIT}`
      );
      if (_.gte(dao.getValue("tmpstmp"), init.context.timestamp)) {
        businessErr.tmpstmpErr = `Timestamp for  /${constants.LOG_ONSEARCH} api cannot be greater than or equal to /init api`;
      }
      dao.setValue("tmpstmp", init.context.timestamp);
    } catch (error) {
      console.log(
        `!!Error while comparing timestamp for /${constants.LOG_ONSEARCH} and /${constants.LOG_INIT} api`,
        error
      );
    }

    try {
      console.log(`Checking Message Ids of /${constants.LOG_INIT}`);
      if (msgIdSet.has(init.context.message_id)) {
        businessErr.msgId2Err =
          "Message Id cannot be same for different sets of APIs";
      }
      dao.setValue("msgId", init.context.message_id);
      // msgIdSet.add(init.context.message_id);
    } catch (error) {
      console.log(
        `Error while checking message id for /${constants.LOG_INIT}`,
        error
      );
    }

    init = data.message.order;
    onsearch = onsearch.message.catalog;

    try {
      console.log(`Checking provider's location  in /${constants.LOG_INIT}`);
      onsearch["bpp/providers"].forEach((prov) => {
        if (prov.id === init.provider.id) {
          if (prov.hasOwnProperty("locations")) {
            if (!init.provider.hasOwnProperty("locations"))
              businessErr.locationErr = `Provider location missing in ${constants.LOG_INIT} api`;
          }
        }
      });
    } catch (error) {
      console.log(`Error fetching the provider's location`, error);
    }

    // try {
    //   console.log(
    //     `Comparing item fulfillment Ids and bpp/fulfillment ids in /${constants.LOG_INIT} and ${constants.LOG_ONSEARCH}`
    //   );
    //   init.fulfillments.forEach((fulfillment) => {
    //     onsearch["bpp/fulfillments"].forEach((bpp_fulfillments) => {
    //       if (!Object.values(bpp_fulfillments).includes(fulfillment.id))
    //         businessErr.ItemfulfillmentErr = `Item fulfillment Id in ${constants.LOG_INIT} does not exist in ${constants.LOG_ONSEARCH}`;
    //       if (!Object.values(bpp_fulfillments).includes(fulfillment.type))
    //         businessErr.ItemfulfillmentErr = `Item fulfillment type in /${constants.LOG_INIT} is different from /${constants.LOG_ONSEARCH}`;
    //     });
    //   });
    // } catch (error) {
    //   console.log(`Error fetching fulfillment details`, error);
    // }
    try {
      console.log(`Checking billing object in /${constants.LOG_INIT}`);
      if (!init["billing"]) {
        businessErr.billErr = `Billing object missing in /${constants.LOG_INIT}`;
      } else {
        const billing = init.billing;
        const tmpstmp = dao.getValue("tmpstmp");
        dao.setValue("billing", billing);
        if (!_.isEqual(billing.created_at, tmpstmp)) {
          businessErr.bllngCrtdErr = `billing.created_at should match context.timestamp`;
        }

        if (!_.isEqual(init.billing.updated_at, tmpstmp)) {
          businessErr.bllngUptdErr = `billing.updated_at should match context.timestamp`;
        }
      }
    } catch (error) {
      console.log(
        `!!Error while checking billing object in /${constants.LOG_INIT}`,
        error
      );
    }

    try {
      console.log(
        `storing payment settlement details in /${constants.LOG_INIT}`
      );
      if(init.hasOwnProperty("fulfillments") && init.fulfillments[0].type==="CoD"){
      if(init.hasOwnProperty("payment")){
      if (init.payment.hasOwnProperty("@ondc/org/settlement_details"))
        dao.setValue(
          "sttlmntdtls",
          init.payment["@ondc/org/settlement_details"][0]
        );
      else {
        businessErr.pymntSttlmntObjErr = `payment settlement_details missing in /${constants.LOG_INIT}`;
      }
    }else{
      businessErr.paymentObjErr=`payment object missing in /${constants.LOG_INIT}`
    }
  }
    } catch (error) {
      console.log(
        `!!Error while storing payment settlement details in /${constants.LOG_INIT}`
      );
    }

    
    result.businessErrors = businessErr;
    return result;
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`!!File not found for /${constants.LOG_INIT} API!`);
    } else {
      console.log(
        `!!Some error occurred while checking /${constants.LOG_INIT} API`,
        err
      );
    }
  }
};

module.exports = checkInit;
