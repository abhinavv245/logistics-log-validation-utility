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
  var res={};
  //SEARCH API
  
  res.search = checkSearch(dirPath, msgIdSet);

  // ON_SEARCH API

  res.on_search = checkOnSearch(dirPath, msgIdSet);

  //INIT API

  res.init= checkInit(dirPath, msgIdSet);

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
  res.support= checkSupport(dirPath, msgIdSet);

  // //ON_SUPPORT API
  res.on_support = checkOnSupport(dirPath, msgIdSet);

//   let logReport = "";

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

//   if (!_.isEmpty(srchObj)) {
//     logReport += `**/search**\n${getObjValues(srchObj)}\n`;
//   }

//   if (!_.isEmpty(onSrchObj)) {
//     logReport += `**/on_search**\n${getObjValues(onSrchObj)}\n`;
//   }



//   if (!_.isEmpty(initObj)) {
//     logReport += `**/init**\n${getObjValues(initObj)}\n`;
//   }

//   if (!_.isEmpty(onInitObj)) {
//     logReport += `**/on_init**\n${getObjValues(onInitObj)}\n`;
//   }

//   if (!_.isEmpty(cnfrmObj)) {
//     logReport += `**/confirm**\n${getObjValues(cnfrmObj)}\n`;
//   }

//   if (!_.isEmpty(onCnfrmObj)) {
//     logReport += `**/on_confirm**\n${getObjValues(onCnfrmObj)}\n`;
//   }

//   if (!_.isEmpty(cnclObj)) {
//     logReport += `**/cancel**\n${getObjValues(cnclObj)}\n`;
//   }

//   if (!_.isEmpty(onCnclObj)) {
//     logReport += `**/on_cancel**\n${getObjValues(onCnclObj)}\n`;
//   }

//   if (!_.isEmpty(trckObj)) {
//     logReport += `**/track**\n${getObjValues(trckObj)}\n`;
//   }

//   if (!_.isEmpty(onTrckObj)) {
//     logReport += `**/on_track**\n${getObjValues(onTrckObj)}\n`;
//   }

//   if (!_.isEmpty(statObj)) {
//     logReport += `**/status**\n${getObjValues(statObj)}\n`;
//   }
//   if (!_.isEmpty(onStatObj)) {
//     logReport += `**/on_status**\n${getObjValues(onStatObj)}\n`;
//   }

//   if (!_.isEmpty(updtObj)) {
//     logReport += `**/update**\n${getObjValues(updtObj)}\n`;
//   }
//   if (!_.isEmpty(onUpdtObj)) {
//     logReport += `**/on_update**\n${getObjValues(onUpdtObj)}\n`;
//   }

//   if (!_.isEmpty(sprtObj)) {
//     logReport += `**/support**\n${getObjValues(sprtObj)}\n`;
//   }

//   if (!_.isEmpty(onSprtObj)) {
//     logReport += `**/on_support** \n${getObjValues(onSprtObj)}\n`;
//   }

  fs.writeFileSync("log_report.json", JSON.stringify(res));

  console.log("Report Generated Successfully!!");
 

};

module.exports = { validateLogs };
