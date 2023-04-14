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
          const:"init"
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
                      required: ["id"],
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
                    start: {
                      type: "object",
                      properties: {
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
                      },
                      required: ["location", "contact"],
                    },
                    end: {
                      type: "object",
                      properties: {
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
                      },
                      required: ["location", "contact"],
                    },
                  },
                  required: ["id", "type", "start", "end"],
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
                          enum :["upi","neft","rtgs"]
                        },
                        beneficiary_name: {
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
                            ],
                          },
                        },
                    ],
                      required: [
                        "settlement_counterparty",
                        "settlement_type",
                        "beneficiary_name",
                      ],
                    },
                
                },
              },
              required: ["@ondc/org/settlement_details"],
            },
          },
          required: ["provider", "items", "fulfillments", "billing"],
        },
      },
      required: ["order"],
    },
  },
  required: ["context", "message"],
};
