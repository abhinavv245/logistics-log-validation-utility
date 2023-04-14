const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const { convertISOtoSeconds } = require("../utils");
const { checkContext } = require("../../services/service");
const validateSchema = require("../schemaValidation");

const checkOnSearch = (dirPath, msgIdSet) => {
  try {
    let data = fs.readFileSync(dirPath + `/${constants.LOG_ONSEARCH}.json`);
    data = JSON.parse(data);
    return validate(
      "logistics",
      constants.LOG_ONSEARCH,
      data,
      msgIdSet,
      dirPath
    );
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`!!File not found for ${constants.LOG_ONSEARCH} API!`);
    } else {
      console.log(
        `!!Some error occurred while checking /${constants.LOG_ONSEARCH} API`
      );
    }
  }
};

const validate = (domain, api, data, msgIdSet, dirPath) => {
  let result = {};
  let onSearch = data;

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
    console.log(`Storing BAP_ID and BPP_ID in /${constants.LOG_ONSEARCH}`);
    dao.setValue("bapId", onSearch.context.bap_id);
    dao.setValue("bppId", onSearch.context.bpp_id);
  } catch (error) {
    console.log(
      `!!Error while storing BAP and BPP Ids in /${constants.LOG_ONSEARCH}`,
      error
    );
  }

  try {
    console.log(`Checking context for ${constants.LOG_ONSEARCH} API`);
    res = checkContext(onSearch.context, constants.LOG_ONSEARCH);
    if (!res.valid) {
      Object.assign(businessErr, res.ERRORS);
    }
  } catch (error) {
    console.log(
      `!!Some error occurred while checking /${constants.LOG_ONSEARCH} context`,
      error
    );
  }

  try {
    console.log(
      `Comparing city of /${constants.LOG_SEARCH} and /${constants.LOG_ONSEARCH}`
    );
    if (!_.isEqual(dao.getValue("city"), onSearch.context.city)) {
      businessErr.city = `City code mismatch in /${constants.LOG_SEARCH} and /${constants.LOG_ONSEARCH}`;
    }
  } catch (error) {
    console.log(
      `!!Error while comparing city in /${constants.LOG_SEARCH} and /${constants.LOG_ONSEARCH}`,
      error
    );
  }

  try {
    console.log(
      `Comparing timestamp of /${constants.LOG_SEARCH} and /${constants.LOG_ONSEARCH}`
    );
    if (_.gte(dao.getValue("tmpstmp"), onSearch.context.timestamp)) {
      businessErr.tmpstmp = `Context timestamp for /${constants.LOG_SEARCH} api cannot be greater than or equal to /${constants.LOG_ONSEARCH} api`;
    }
    dao.setValue("tmpstmp", onSearch.context.timestamp);
  } catch (error) {
    console.log(
      `!!Error while comparing timestamp for /${constants.LOG_SEARCH} and /${constants.LOG_ONSEARCH} api`,
      error
    );
  }

  try {
    console.log(
      `Comparing transaction Ids of /${constants.LOG_SEARCH} and /${constants.LOG_ONSEARCH}`
    );
    if (!_.isEqual(dao.getValue("txnId"), onSearch.context.transaction_id)) {
      businessErr.txnId = `Transaction Id for /${constants.LOG_SEARCH} and /${constants.LOG_ONSEARCH} api should be same`;
    }
    // dao.setValue("txnId", onSearch.context.transaction_id);
  } catch (error) {
    console.log(
      `!!Error while comparing transaction ids for /${constants.LOG_SEARCH} and /${constants.LOG_ONSEARCH} api`,
      error
    );
  }

  try {
    console.log(
      `Comparing Message Ids of /${constants.LOG_SEARCH} and /${constants.LOG_ONSEARCH}`
    );
    if (!_.isEqual(dao.getValue("msgId"), onSearch.context.message_id)) {
      businessErr.msgId = `Message Id for /${constants.LOG_SEARCH} and /${constants.LOG_ONSEARCH} api should be same`;
    }
    msgIdSet.add(onSearch.context.message_id);
  } catch (error) {
    console.log(
      `Error while comparing message ids for /${constants.LOG_SEARCH} and /${constants.LOG_ONSEARCH} api`,
      error
    );
  }

  onSearch = onSearch.message.catalog;
  // console.log(onSearch["bpp/providers"]);
  dao.setValue("onSearch", onSearch);

  //TAT for category or item is required
  try {
    console.log(
      `Checking TAT for category or item in ${constants.LOG_ONSEARCH} api`
    );
    if (onSearch.hasOwnProperty("bpp/providers")) {
      onSearch["bpp/providers"].forEach((provider) => {
        provider.categories.forEach((category) => {
          const catName = category.id;
          const categoryTime = category.time;
          provider.items.forEach((item) => {
            const catId = item.category_id;
            const itemTime = item.time;
            if (catName === catId && !categoryTime && !itemTime)
              businessErr.TAT = `Either Category level TAT or Item level TAT should be given in ${constants.LOG_ONSEARCH} api for category "${catName}"`;
          });
        });
      });
    }
  } catch (error) {
    console.log(`!!Error while fetching category and item TAT`, error);
  }

  try {
    console.log(`Checking P2H2P true or not in ${constants.LOG_ONSEARCH}`);
    if (onSearch.hasOwnProperty("bpp/providers")) {
      if (onSearch["bpp/providers"][0].items[0].descriptor.code === "P2H2P") {
        dao.setValue("p2h2p", true);
      } else {
        dao.setValue("p2h2p", false);
      }
    }
  } catch (error) {
    console.log(
      `!!Error while checking P2H2P for /${constants.LOG_ONSEARCH} api`,
      error
    );
  }

  const datesAreOnSameDay = (first, second) => {
    var start = new Date(first);
    var end = new Date(second);

    if (start.getDay() === end.getDay()) return true;
    return false;
  };
  const datesAreOnNextDay = (first, second) => {
    var start = new Date(first);
    var end = new Date(second);
    if (start.getDay() + 1 === end.getDay()) return true;
    return false;
  };

  try {
    console.log(
      `Checking item TAT limit for different logistic categories in ${constants.LOG_ONSEARCH} api`
    );
    if (onSearch.hasOwnProperty("bpp/providers")) {
      onSearch["bpp/providers"].forEach((provider) => {
        provider.items.forEach((item) => {
          const catId = item.category_id;
          if (item.hasOwnProperty("time")) {
            switch (catId) {
              case "Immediate Delivery":
                const itemTime = convertISOtoSeconds(item.time.duration);
                if (_.gte(itemTime, 3600))
                  businessErr.itemTatErr = `Item TAT should not exceed 60 minutes in ${constants.LOG_ONSEARCH} api for category ${catId}`;
                break;
              case "Same Day Delivery":
                if (
                  !datesAreOnSameDay(
                    dao.getValue("tmpstmp"),
                    item.time.timestamp
                  )
                ) {
                  businessErr.logTimestampErr = `Item TAT timestamp should be the same day as context time stamp in
                      ${constants.LOG_ONSEARCH} api for category ${catId}`;
                }
                break;
              case "Next Day Delivery":
                if (
                  !datesAreOnNextDay(
                    dao.getValue("tmpstmp"),
                    item.time.timestamp
                  )
                ) {
                  businessErr.logTimestampErr = `Item TAT timestamp should be the next day as context time stamp in ${constants.LOG_ONSEARCH} api for category ${catId}`;
                }
                break;
            }
          }
        });
      });
    }
  } catch (error) {
    console.log(`Error while fetching item TAT`, error);
  }

  result.businessErrors = businessErr;
  // dao.setValue("onSrchObj", onSrchObj);
  return result;
};

module.exports = checkOnSearch;
