module.exports = {
  type: "object",
  properties: {
    context: {
      type: "object",
      properties: {
        domain: {
          type: "string",
          const: "nic2004:60232",
        },
        country: {
          type: "string",
        },
        city: {
          type: "string",
        },
        action: {
          type: "string",
          const: "on_support",
        },
        core_version: {
          type: "string",
          const:"1.1.0"
        },
        bap_id: {
          type: "string",
        },
        bap_uri: {
          type: "string",
        },
        bpp_id: {
          type: "string",
        },
        bpp_uri: {
          type: "string",
        },
        transaction_id: {
          type: "string",
          format:"uuid"
        },
        message_id: {
          type: "string",
        },
        timestamp: {
          type: "string",
          format:"date-time"
        },
      },
      required: [
        "domain",
        "country",
        "city",
        "action",
        "core_version",
        "bap_id",
        "bap_uri",
        "bpp_id",
        "bpp_uri",
        "transaction_id",
        "message_id",
        "timestamp",
      ],
    },
    message: {
      type: "object",
      properties: {
        phone: {
          type: "string",
        },
        email: {
          type: "string",
        },
        uri: {
          type: "string",
        },
      },
      required: ["phone", "email", "uri"],
    },
  },
  required: ["context", "message"],
};
