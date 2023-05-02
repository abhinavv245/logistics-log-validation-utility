const fs = require("fs");
const _ = require("lodash");
const dao = require("../dao/dao");
// const path = require("path");
const { getObjValues } = require("./utils");
const checkSearch = require("./logistics/logSearch");
const checkOnSearch = require("./logistics/logOnSearch");
const checkInit = require("./logistics/logInit");
const checkOnInit = require("./logistics/logOnInit");
const checkConfirm = require("./logistics/logConfirm");
const checkOnConfirm = require("./logistics/logOnConfirm");
const checkStatus = require("./logistics/logStatus");
const checkOnStatus = require("./logistics/logOnStatus");
const checkTrack = require("./logistics/logTrack");
const checkOnTrack = require("./logistics/logOnTrack");
const checkCancel = require("./logistics/logCancel");
const checkOnCancel = require("./logistics/logOnCancel");
const checkSupport = require("./logistics/logSupport");
const checkOnSupport = require("./logistics/logOnSupport");
const checkUpdate = require("./logistics/logUpdate");
const checkOnUpdate = require("./logistics/logOnUpdate");

//TAT in on_select = sumof(time to ship in /on_search and TAT by LSP in logistics /on_search)
// If non-serviceable in /on_select, there should be domain-error

const validateLogs = (dirPath) => {
  // const dirPath = path.join(__dirname, "test_logs");

  let msgIdSet = new Set();
  var res = {};
  //SEARCH API

  res.search = checkSearch(dirPath, msgIdSet);

  // ON_SEARCH API

  res.on_search = checkOnSearch(dirPath, msgIdSet);

  //INIT API

  res.init = checkInit(dirPath, msgIdSet);

  //ON_INIT API

  res.on_init = checkOnInit(dirPath, msgIdSet);

  //CONFIRM API

  res.confirm = checkConfirm(dirPath, msgIdSet);

  //ON_CONFIRM API

  res.on_confirm = checkOnConfirm(dirPath, msgIdSet);

  // //STATUS API
  res.status = checkStatus(dirPath, msgIdSet);

  //   // //ON_STATUS API

  res.on_status = checkOnStatus(dirPath, msgIdSet);

  // //UPDATE API

  res.update = checkUpdate(dirPath, msgIdSet);

  //ON_UPDATE API

  res.on_update = checkOnUpdate(dirPath, msgIdSet);

  // //TRACK API

  res.track = checkTrack(dirPath, msgIdSet);

  // //ON_TRACK API

  res.on_track = checkOnTrack(dirPath, msgIdSet);

  // //CANCEL API

  res.cancel = checkCancel(dirPath, msgIdSet);

  // //ON_CANCEL API

  res.on_cancel = checkOnCancel(dirPath, msgIdSet);

  // //SUPPORT API
  res.support = checkSupport(dirPath, msgIdSet);

  // //ON_SUPPORT API
  res.on_support = checkOnSupport(dirPath, msgIdSet);

  let logReport = "";

  //   let srchObj = dao.getValue("srchObj");
  //   let onSrchObj = dao.getValue("onSrchObj");

  //   let initObj = dao.getValue("initObj");
  //   let onInitObj = dao.getValue("onInitObj");
  //   let cnfrmObj = dao.getValue("cnfrmObj");
  //   let onCnfrmObj = dao.getValue("onCnfrmObj");
  //   let cnclObj = dao.getValue("cnclObj");
  //   let onCnclObj = dao.getValue("onCnclObj");
  //   let trckObj = dao.getValue("trckObj");
  //   let onTrckObj = dao.getValue("onTrckObj");
  //   let sprtObj = dao.getValue("sprtObj");
  //   let onSprtObj = dao.getValue("onSprtObj");
  //   let updtObj = dao.getValue("updtObj");
  //   let onUpdtObj = dao.getValue("onUpdtObj");
  //   let statObj = dao.getValue("statObj");
  //   let onStatObj = dao.getValue("onStatObj");

  //   try {
  //     console.log("Flushing DB Data");
  //     dao.dropDB();
  //   } catch (error) {
  //     console.log("Error while removing LMDB");
  //   }

  // if (!_.isEmpty(res.search.schemaError)) {
  //   logReport += `**/search**(schema errors)\n${getObjValues(res.search.schemaError)}`;
  // }

  // if (!_.isEmpty(res.search.businessErrors)) {
  //   logReport += `**/search**(business errors)\n${getObjValues(res.search.businessErrors)}\n`;
  // }

  // if (!_.isEmpty(res.on_search.schemaError)) {
  //   logReport += `**/on_search**(schema errors)\n${getObjValues(res.on_search.schemaError)}`;
  // }

  // if (!_.isEmpty(res.on_search.businessErrors)) {
  //   logReport += `**/on_search**(business errors)\n\n${getObjValues(res.on_search.businessErrors)}\n`;
  // }
  // if (!_.isEmpty(res.init.schemaError)) {
  //   logReport += `**/init**(schema errors)\n${getObjValues(res.init.schemaError)}`;
  // }

  // if (!_.isEmpty(res.init.businessErrors)) {
  //   logReport += `**/init**(business errors)${getObjValues(res.init.businessErrors)}\n`;
  // }
  // if (!_.isEmpty(res.on_init.schemaError)) {
  //   logReport += `**/on_init**(schema errors)\n${getObjValues(res.on_init.schemaError)}`;
  // }

  // if (!_.isEmpty(res.on_init.businessErrors)) {
  //   logReport += `**/on_init**(business errors)${getObjValues(res.on_init.businessErrors)}\n`;
  // }
  // if (!_.isEmpty(res.confirm.schemaError)) {
  //   logReport += `**/confirm**(schema errors)\n${getObjValues(res.confirm.schemaError)}`;
  // }

  // if (!_.isEmpty(res.confirm.businessErrors)) {
  //   logReport += `**/confirm**(business errors)${getObjValues(res.confirm.businessErrors)}\n`;
  // }
  // if (!_.isEmpty(res.on_confirm.schemaError)) {
  //   logReport += `**/on_confirm**(schema errors)\n${getObjValues(res.on_confirm.schemaError)}`;
  // }

  // if (!_.isEmpty(res.on_confirm.businessErrors)) {
  //   logReport += `**/on_confirm**(business errors)${getObjValues(res.on_confirm.businessErrors)}\n`;
  // }

  // if (!_.isEmpty(res.update.schemaError)) {
  //   logReport += `**/update**(schema errors)\n${getObjValues(res.update.schemaError)}`;
  // }

  // if (!_.isEmpty(res.update.businessErrors)) {
  //   logReport += `**/update**(business errors)${getObjValues(res.update.businessErrors)}\n`;
  // }
  // if (!_.isEmpty(res.on_update.schemaError)) {
  //   logReport += `**/on_update**(schema errors)\n${getObjValues(res.on_update.schemaError)}`;
  // }

  // if (!_.isEmpty(res.on_update.businessErrors)) {
  //   logReport += `**/on_update**(business errors)${getObjValues(res.on_update.businessErrors)}\n`;
  // }

  // if (!_.isEmpty(res.status.schemaError)) {
  //   logReport += `**/status**(schema errors)\n${getObjValues(res.status.schemaError)}`;
  // }

  // if (!_.isEmpty(res.status.businessErrors)) {
  //   logReport += `**/status**(business errors)${getObjValues(res.status.businessErrors)}\n`;
  // }
  // if (!_.isEmpty(res.on_status.schemaError)) {
  //   logReport += `**/on_status**(schema errors)\n${getObjValues(res.on_status.schemaError)}`;
  // }

  // if (!_.isEmpty(res.on_status.businessErrors)) {
  //   logReport += `**/on_status**(business errors)${getObjValues(res.on_status.businessErrors)}\n`;
  // }
  // if (!_.isEmpty(res.cancel.schemaError)) {
  //   logReport += `**/cancel**(schema errors)\n${getObjValues(res.cancel.schemaError)}`;
  // }

  // if (!_.isEmpty(res.cancel.businessErrors)) {
  //   logReport += `**/cancel**(business errors)${getObjValues(res.cancel.businessErrors)}\n`;
  // }
  // if (!_.isEmpty(res.on_cancel.schemaError)) {
  //   logReport += `**/on_cancel**(schema errors)\n${getObjValues(res.on_cancel.schemaError)}`;
  // }

  // if (!_.isEmpty(res.on_cancel.businessErrors)) {
  //   logReport += `**/on_cancel**(business errors)${getObjValues(res.on_cancel.businessErrors)}\n`;
  // }
  // if (!_.isEmpty(res.track.schemaError)) {
  //   logReport += `**/track**(schema errors)\n${getObjValues(res.track.schemaError)}`;
  // }

  // if (!_.isEmpty(res.track.businessErrors)) {
  //   logReport += `**/track**(business errors)${getObjValues(res.track.businessErrors)}\n`;
  // }
  // if (!_.isEmpty(res.on_track.schemaError)) {
  //   logReport += `**/on_track**(schema errors)\n${getObjValues(res.on_track.schemaError)}`;
  // }

  // if (!_.isEmpty(res.on_track.businessErrors)) {
  //   logReport += `**/on_track**(business errors)${getObjValues(res.on_track.businessErrors)}\n`;
  // }
  // if (!_.isEmpty(res.support.schemaError)) {
  //   logReport += `**/support**(schema errors)\n${getObjValues(res.support.schemaError)}`;
  // }

  // if (!_.isEmpty(res.support.businessErrors)) {
  //   logReport += `**/support**(business errors)${getObjValues(res.support.businessErrors)}\n`;
  // }
  // if (!_.isEmpty(res.on_support.schemaError)) {
  //   logReport += `**/support**(schema errors)\n${getObjValues(res.support.schemaError)}`;
  // }

  // if (!_.isEmpty(res.on_support.businessErrors)) {
  //   logReport += `**/on_support**(business errors)${getObjValues(res.on_support.businessErrors)}\n`;
  // }

  fs.writeFileSync("log_report.json", JSON.stringify(res));
  fs.writeFileSync("log_report.md", logReport);

  console.log("Report Generated Successfully!!");
};

module.exports = { validateLogs };
