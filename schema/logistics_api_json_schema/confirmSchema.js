module.exports = {
  type: "object",
  properties: {
    context: {
      type: "object",
      properties: {
        domain: {
          type: "string",
          const: "nic2004:60232"
        },
        country: {
          type: "string",
          
        },
        city: {
          type: "string",
        },
        action: {
          type: "string",
          const:"confirm"
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
        ttl: {
          type: "string",
          const:"PT30S"
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
        order: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            state: {
              type: "string",
            },
            provider: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                },
                locations: {
                  type: "array",
                  items: 
                    {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                        },
                      },
                    },
                  
                },
              },
              required: ["id"],
            },
            items: {
              type: "array",
              items: 
                {
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
            quote: {
              type: "object",
              properties: {
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
                breakup: {
                  type: "array",
                  items:
                    {
                      type: "object",
                      properties: {
                        "@ondc/org/item_id": {
                          type: "string",
                        },
                        "@ondc/org/title_type": {
                          type: "string",
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
                        "@ondc/org/item_id",
                        "@ondc/org/title_type",
                        "price",
                      ],
                    },
                  
                },
              },
              required: ["price", "breakup"],
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
                    "@ondc/org/awb_no": {
                      type: "string",
                    },
                    start: {
                      type: "object",
                      properties: {
                        person: {
                          type: "object",
                          properties: {
                            name: {
                              type: "string",
                            },
                          },
                          required: ["name"],
                        },
                        location: {
                          type: "object",
                          properties: {
                            gps: {
                              type: "string",
                            },
                            address: {
                              type: "object",
                              properties: {
                                name: {
                                  type: "string",
                                },
                                building: {
                                  type: "string",
                                },
                                locality: {
                                  type: "string",
                                },
                                city: {
                                  type: "string",
                                },
                                state: {
                                  type: "string",
                                },
                                country: {
                                  type: "string",
                                },
                                area_code: {
                                  type: "string",
                                },
                              },
                              required: [
                                "name",
                                "building",
                                "locality",
                                "city",
                                "state",
                                "country",
                                "area_code",
                              ],
                            },
                          },
                          required: ["gps", "address"],
                        },
                        contact: {
                          type: "object",
                          properties: {
                            phone: {
                              type: "string",
                            },
                            email: {
                              type: "string",
                            },
                          },
                          required: ["phone", "email"],
                        },
                        instructions: {
                          type: "object",
                          properties: {
                            short_desc: {
                              type: "string",
                            },
                            long_desc: {
                              type: "string",
                            },
                            images: {
                              type: "array",
                              items: 
                                {
                                  type: "string",
                                },
                              
                            },
                          },
                          required: ["long_desc", "images"],
                        },
                      },
                      required: [
                        "person",
                        "location",
                        "contact",
                        "instructions",
                      ],
                    },
                    end: {
                      type: "object",
                      properties: {
                        person: {
                          type: "object",
                          properties: {
                            name: {
                              type: "string",
                            },
                          },
                          required: ["name"],
                        },
                        location: {
                          type: "object",
                          properties: {
                            gps: {
                              type: "string",
                            },
                            address: {
                              type: "object",
                              properties: {
                                name: {
                                  type: "string",
                                },
                                building: {
                                  type: "string",
                                },
                                locality: {
                                  type: "string",
                                },
                                city: {
                                  type: "string",
                                },
                                state: {
                                  type: "string",
                                },
                                country: {
                                  type: "string",
                                },
                                area_code: {
                                  type: "string",
                                },
                              },
                              required: [
                                "name",
                                "building",
                                "locality",
                                "city",
                                "state",
                                "country",
                                "area_code",
                              ],
                            },
                          },
                          required: ["gps", "address"],
                        },
                        contact: {
                          type: "object",
                          properties: {
                            phone: {
                              type: "string",
                            },
                            email: {
                              type: "string",
                            },
                          },
                          required: ["phone"],
                        },
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
                            "long_desc",
                            "additional_desc",
                          ],
                        },
                      },
                      required: [
                        "person",
                        "location",
                        "contact",
                        "instructions",
                      ],
                    },
                    "@ondc/org/ewaybillno": {
                      type: "string",
                    },
                    "@ondc/org/ebnexpirydate": {
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
                  },
                  required: [
                    "id",
                    "type",
                    "start",
                    "end",
                    "tags",
                  ],
                },
              
            },
            billing: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                },
                address: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                    },
                    building: {
                      type: "string",
                    },
                    locality: {
                      type: "string",
                    },
                    city: {
                      type: "string",
                    },
                    state: {
                      type: "string",
                    },
                    country: {
                      type: "string",
                    },
                    area_code: {
                      type: "string",
                    },
                  },
                  required: [
                    "name",
                    "building",
                    "locality",
                    "city",
                    "state",
                    "country",
                    "area_code",
                  ],
                },
                tax_number: {
                  type: "string",
                },
                phone: {
                  type: "string",
                },
                email: {
                  type: "string",
                },
                created_at: {
                  type: "string",
                },
                updated_at: {
                  type: "string",
                },
              },
              required: [
                "name",
                "address",
                "tax_number",
                "phone",
                "email",
                "created_at",
                "updated_at",
              ],
            },
            payment: {
              type: "object",
              properties: {
                "@ondc/org/collection_amount": {
                  type: "string",
                },
                collected_by: {
                  type: "string",
                },
                type: {
                  type: "string",
                },
                "@ondc/org/settlement_details": {
                  type: "array",
                  items: 
                    {
                      type: "object",
                      properties: {
                        settlement_counterparty: {
                          type: "string",
                        },
                        settlement_type: {
                          type: "string",
                        },
                        upi_address: {
                          type: "string",
                        },
                        settlement_bank_account_no: {
                          type: "string",
                        },
                        settlement_ifsc_code: {
                          type: "string",
                        },
                      },
                      allOf: [
                        {
                          if: {
                            properties: {
                              settlement_type: {
                                const: "upi",
                              },
                            },
                          },
                          then: {
                            required: ["upi_address"],
                          },
                        },
                        {
                          if: {
                            properties: {
                              settlement_type: {
                                const: ["neft","rtgs"]
                              },
                            },
                          },
                          then: {
                            required: [
                              "settlement_ifsc_code",
                              "settlement_bank_account_no",
                              "bank_name",
                              "branch_name",
                            ],
                          },
                        },
                    ],
                      required: [
                        "settlement_counterparty",
                        "settlement_type",
                      ],
                    },
                  
                },
              },
              required: [
                "@ondc/org/collection_amount",
                "collected_by",
                "type",
                "@ondc/org/settlement_details",
              ],
            },
            "@ondc/org/linked_order": {
              type: "object",
              properties: {
                items: {
                  type: "array",
                  items: 
                    {
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
                provider: {
                  type: "object",
                  properties: {
                    descriptor: {
                      type: "object",
                      properties: {
                        name: {
                          type: "string",
                        },
                      },
                      required: ["name"],
                    },
                    address: {
                      type: "object",
                      properties: {
                        name: {
                          type: "string",
                        },
                        street: {
                          type: "string",
                        },
                        locality: {
                          type: "string",
                        },
                        city: {
                          type: "string",
                        },
                        state: {
                          type: "string",
                        },
                        area_code: {
                          type: "string",
                        },
                      },
                      required: [
                        "name",
                        "street",
                        "locality",
                        "city",
                        "state",
                        "area_code",
                      ],
                    },
                  },
                  required: ["descriptor", "address"],
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
              required: ["items", "provider", "order"],
            },
            created_at: {
              type: "string",
            },
            updated_at: {
              type: "string",
            },
          },
          required: [
            "id",
            "state",
            "provider",
            "items",
            "quote",
            "fulfillments",
            "billing",
            "payment",
            "@ondc/org/linked_order",
            "created_at",
            "updated_at",
          ],
        },
      },
      required: ["order"],
    },
  },
  required: ["context", "message"],
};
