const onConfirmSchema = require("./onConfirmSchema");
const onInitSchema = require("./onInitSchema");
const onSearchSchema = require("./onSearchSchema");
const onTrackSchema = require("./onTrackSchema");
const onSupportSchema = require("./onSupportSchema");
const onStatusSchema = require("./onStatusSchema");
const onCancelSchema = require("./onCancelSchema");
const onUpdateSchema = require("./onUpdateSchema");
const searchSchema = require("./searchSchema");
const initSchema = require("./initSchema");
const confirmSchema = require("./confirmSchema");
const statusSchema = require("./statusSchema");
const updateSchema = require("./updateSchema");
const cancelSchema = require("./cancelSchema");
const supportSchema=require("./supportSchema");
const trackSchema=require("./trackSchema");

const Ajv = require("ajv");
const ajv = new Ajv({
  allErrors: true,
  strict: "log",
});
const addFormats = require("ajv-formats");
addFormats(ajv);
require("ajv-errors")(ajv);

const formatted_error = (errors) => {
  error_list = [];
  let status = "";
  errors.forEach((error) => {
    error_dict = {
      message: `${error.message}${
        error.params.allowedValues ? ` (${error.params.allowedValues})` : ""
      }${error.params.allowedValue ? ` (${error.params.allowedValue})` : ""}${
        error.params.additionalProperty
          ? ` (${error.params.additionalProperty})`
          : ""
      }`,
      details: error.instancePath,
    };
    error_list.push(error_dict);
  });
  if (error_list.length === 0) status = "pass";
  else status = "fail";
  error_json = { errors: error_list, status: status };
  return error_json;
};

const validate_schema = (data, schema) => {
  let error_list = [];
  validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    error_list = validate.errors;
  }
  return error_list;
};

const validate_schema_search_logistics_for_json = (data) => {
  error_list = validate_schema(data, (schema = searchSchema));
  return formatted_error(error_list);
};

const validate_schema_on_search_logistics_for_json = (data) => {
  // transformed_item_data = transform_on_search_schema(data);
  error_list = validate_schema(data, (schema = onSearchSchema));
  return formatted_error(error_list);
};

const validate_schema_select_logistics_for_json = (data) => {
  error_list = validate_schema(data, (schema = selectSchema));
  return formatted_error(error_list);
};

const validate_schema_on_select_logistics_for_json = (data) => {

  error_list = validate_schema(data, (schema = onSelectSchema));
  return formatted_error(error_list);
};

const validate_schema_init_logistics_for_json = (data) => {
  error_list = validate_schema(data, (schema = initSchema));
  return formatted_error(error_list);
};

const validate_schema_on_init_logistics_for_json = (data) => {
  error_list = validate_schema(data, (schema = onInitSchema));
  return formatted_error(error_list);
};

const validate_schema_confirm_logistics_for_json = (data) => {
  error_list = validate_schema(data, (schema = confirmSchema));
  return formatted_error(error_list);
};

const validate_schema_on_confirm_logistics_for_json = (data) => {

  error_list = validate_schema(data, (schema = onConfirmSchema));
  return formatted_error(error_list);
};

const validate_schema_status_logistics_for_json = (data) => {
  error_list = validate_schema(data, (schema = statusSchema));
  return formatted_error(error_list);
};

const validate_schema_on_status_logistics_for_json = (data) => {

  error_list = validate_schema(data, (schema = onStatusSchema));
  return formatted_error(error_list);
};

const validate_schema_cancel_logistics_for_json = (data) => {
  error_list = validate_schema(data, (schema = cancelSchema));
  return formatted_error(error_list);
};

const validate_schema_on_cancel_logistics_for_json = (data) => {

  error_list = validate_schema(data, (schema = onCancelSchema));
  return formatted_error(error_list);
};

const validate_schema_update_logistics_for_json = (data) => {
  error_list = validate_schema(data, (schema = updateSchema));
  return formatted_error(error_list);
};

const validate_schema_on_update_logistics_for_json = (data) => {

  error_list = validate_schema(data, (schema = onUpdateSchema));
  return formatted_error(error_list);
};

const validate_schema_track_logistics_for_json = (data) => {
  error_list = validate_schema(data, (schema = trackSchema));
  return formatted_error(error_list);
};

const validate_schema_on_track_logistics_for_json = (data) => {
 
  error_list = validate_schema(data, (schema = onTrackSchema));
  return formatted_error(error_list);
};

const validate_schema_support_logistics_for_json = (data) => {
  error_list = validate_schema(data, (schema = supportSchema));
  return formatted_error(error_list);
};

const validate_schema_on_support_logistics_for_json = (data) => {

  error_list = validate_schema(data, (schema = onSupportSchema));
  return formatted_error(error_list);
};

module.exports = {
  validate_schema_search_logistics_for_json,
  validate_schema_select_logistics_for_json,
  validate_schema_init_logistics_for_json,
  validate_schema_confirm_logistics_for_json,
  validate_schema_update_logistics_for_json,
  validate_schema_status_logistics_for_json,
  validate_schema_track_logistics_for_json,
  validate_schema_cancel_logistics_for_json,
  validate_schema_support_logistics_for_json,
  validate_schema_on_cancel_logistics_for_json,
  validate_schema_on_confirm_logistics_for_json,
  validate_schema_on_init_logistics_for_json,
  validate_schema_on_search_logistics_for_json,
  validate_schema_on_select_logistics_for_json,
  validate_schema_on_status_logistics_for_json,
  validate_schema_on_support_logistics_for_json,
  validate_schema_on_track_logistics_for_json,
  validate_schema_on_update_logistics_for_json,
};
