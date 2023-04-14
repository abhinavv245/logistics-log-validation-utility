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
          const: "update",
        },
        core_version: {
          type: "string",
          const: "1.1.0",
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
          format: "date-time",
        },
        ttl: {
          type: "string",
          const: "PT30S",
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
        "ttl",
      ],
    },
    message: {
      type: "object",
      properties: {
        update_target: {
          type: "string",
        },
        order: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            state: {
              type: "string",
            },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                  },
                  category_id: {
                    type: "string",
                  },
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
                required: ["id", "category_id", "descriptor"],
              },
            },
            fulfillments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                  },
                  type: {
                    type: "string",
                  },
                  "@ondc/org/awb_no": {
                    type: "string",
                  },
                  tags: {
                    type: "object",
                    properties: {
                      "@ondc/org/order_ready_to_ship": {
                        type: "string",
                      },
                    },
                    required: ["@ondc/org/order_ready_to_ship"],
                  },
                  start: {
                    type: "object",
                    properties: {
                      instructions: {
                        type: "object",
                        properties: {
                          short_desc: {
                            type: "string",
                          },
                          long_desc: {
                            type: "string",
                          },
                          additional_desc: {
                            type: "object",
                            properties: {
                              content_type: {
                                type: "string",
                              },
                              url: {
                                type: "string",
                              },
                            },
                            required: ["content_type", "url"],
                          },
                        },
                        required: [
                          "short_desc",
                          "long_desc",
                          "additional_desc",
                        ],
                      },
                    },
                    required: ["instructions"],
                  },
                  end: {
                    type: "object",
                    properties: {
                      instructions: {
                        type: "object",
                        properties: {
                          short_desc: {
                            type: "string",
                          },
                          long_desc: {
                            type: "string",
                          },
                          additional_desc: {
                            type: "object",
                            properties: {
                              content_type: {
                                type: "string",
                              },
                              url: {
                                type: "string",
                              },
                            },
                            required: ["content_type", "url"],
                          },
                        },
                        required: [
                          "short_desc",
                          "long_desc",
                          "additional_desc",
                        ],
                      },
                    },
                    required: ["instructions"],
                  },
                  "@ondc/org/ewaybillno": {
                    type: "string",
                  },
                  "@ondc/org/ebnexpirydate": {
                    type: "string",
                  },
                },
                required: ["id", "type", "tags"],
              },
            },
            "@ondc/org/linked_order": {
              type: "object",
              properties: {
                items: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      category_id: {
                        type: "string",
                      },
                      descriptor: {
                        type: "object",
                        properties: {
                          name: {
                            type: "string",
                          },
                        },
                        required: ["name"],
                      },
                      quantity: {
                        type: "object",
                        properties: {
                          count: {
                            type: "integer",
                          },
                          measure: {
                            type: "object",
                            properties: {
                              unit: {
                                type: "string",
                              },
                              value: {
                                type: "number",
                              },
                            },
                            required: ["unit", "value"],
                          },
                        },
                        required: ["count", "measure"],
                      },
                      price: {
                        type: "object",
                        properties: {
                          currency: {
                            type: "string",
                          },
                          value: {
                            type: "string",
                          },
                        },
                        required: ["currency", "value"],
                      },
                    },
                    required: [
                      "category_id",
                      "descriptor",
                      "quantity",
                      "price",
                    ],
                  },
                },
                order: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                    },
                    weight: {
                      type: "object",
                      properties: {
                        unit: {
                          type: "string",
                        },
                        value: {
                          type: "number",
                        },
                      },
                      required: ["unit", "value"],
                    },
                  },
                  required: ["id", "weight"],
                },
              },
              required: ["items", "order"],
            },
            updated_at: {
              type: "string",
            },
          },
          required: ["id", "state", "items", "fulfillments", "updated_at"],
        },
      },
      required: ["update_target", "order"],
    },
  },
  required: ["context", "message"],
};
