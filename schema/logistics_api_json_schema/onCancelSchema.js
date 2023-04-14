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
          const: "on_cancel",
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
        order: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            state: {
              type: "string",
            },
            fulfillments: {
              type: "array",
              items: 
                {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                    },
                    type: {
                      type: "string",
                    },
                    state: {
                      type: "object",
                      properties: {
                        descriptor: {
                          type: "object",
                          properties: {
                            code: {
                              type: "string",
                            },
                          },
                          required: ["code"],
                        },
                      },
                      required: ["descriptor"],
                    },
                    tags: {
                      type: "object",
                      properties: {
                        cancellation_reason_id: {
                          type: "string",
                        },
                        "AWB no": {
                          type: "string",
                        },
                      },
                      required: ["cancellation_reason_id"],
                    },
                  },
                  required: ["id", "type", "state", "tags"],
                },
            
            },
          },
          required: ["id", "state", "fulfillments"],
        },
      },
      required: ["order"],
    },
  },
  required: ["context", "message"],
};
