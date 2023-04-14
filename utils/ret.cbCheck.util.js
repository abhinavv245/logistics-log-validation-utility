const { validateLogsUtil } = require("./validateRetailLogUtil");

const validateLogs = (domain) => {
  validateLogsUtil(domain);
};

module.exports = { validateLogs };
