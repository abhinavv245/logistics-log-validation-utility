const express = require("express");
const router = express.Router();
const service = require("../services/service");
const { validateLog } = require("../services/cbCheck.service");
const logResponse=require("../utils/validateLogisticsLogUtil");

router.post("/validateSchema/:path", (req, res) => {
  const path = req.params.path;
  const data = req.body;
  const result = service.schemaValidation(domain, data, path);
  res.json(result);
});

router.post("/CheckContext/:path", (req, res) => {
  const path = req.params.path;
  const data = req.body.context;
  const result = service.checkContext(data, path);
  res.json(result);
});

router.post("/ValidateLog/:domain", (req, res) => {
  const domain = req.params.domain;
  const data=req.body;
  const logResponse=validateLog(domain,data);
  res.send(logResponse);
});

module.exports = router;
