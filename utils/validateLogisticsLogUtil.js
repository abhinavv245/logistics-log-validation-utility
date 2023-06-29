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

  if (!_.isEmpty(res.search)) {
    logReport += `**/search**\n${getObjValues(res.search)}\n`;
  }


  if (!_.isEmpty(res.on_search)) {
    logReport += `**/on_search**\n${getObjValues(res.on_search)}\n`;
  }

  if (!_.isEmpty(res.init)) {
    logReport += `**/init**\n${getObjValues(res.init)}\n`;
  }

  if (!_.isEmpty(res.on_init)) {
    logReport += `**/on_init**\n${getObjValues(res.on_init)}\n`;
  }


  if (!_.isEmpty(res.confirm)) {
    logReport += `**/confirm**\n${getObjValues(res.confirm)}\n`;
  }

 
  if (!_.isEmpty(res.on_confirm)) {
    logReport += `**/on_confirm**\n${getObjValues(res.on_confirm)}\n`;
  }


  if (!_.isEmpty(res.update)) {
    logReport += `**/update**\n${getObjValues(res.update)}\n`;
  }

  if (!_.isEmpty(res.on_update)) {
    logReport += `**/on_update**\n${getObjValues(res.on_update)}\n`;
  }


  if (!_.isEmpty(res.status)) {
    logReport += `**/status**\n${getObjValues(res.status)}\n`;
  }

  if (!_.isEmpty(res.on_status)) {
    logReport += `**/on_status**\n${getObjValues(res.on_status)}\n`;
  }


  if (!_.isEmpty(res.cancel)) {
    logReport += `**/cancel**\n${getObjValues(res.cancel)}`;
  }


  if (!_.isEmpty(res.on_cancel)) {
    logReport += `**/on_cancel**\n${getObjValues(res.on_cancel)}`;
  }


  if (!_.isEmpty(res.track)) {
    logReport += `**/track**\n${getObjValues(res.track)}`;
  }


  if (!_.isEmpty(res.on_track)) {
    logReport += `**/on_track**\n${getObjValues(res.on_track)}`;
  }

  if (!_.isEmpty(res.support)) {
    logReport += `**/support**\n${getObjValues(res.support)}`;
  }


  if (!_.isEmpty(res.on_support)) {
    logReport += `**/support**\n${getObjValues(res.support)}`;
  }


  // fs.writeFileSync("log_report.json", JSON.stringify(res));
  fs.writeFileSync("log_report.md", logReport);

  console.log("Report Generated Successfully!!");
};

module.exports = { validateLogs };
