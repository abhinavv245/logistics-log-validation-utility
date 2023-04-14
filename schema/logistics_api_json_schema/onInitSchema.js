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
          const:"on_init"
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
          format: "date-time" 
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
            provider: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                },
              },
              required: ["id"],
            },
            provider_location: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                },
              },
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
                  },
                  required: ["id"],
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
                          enum:["Delivery Charge","RTO Charge","Reverse QC Charge","Tax"]
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
            payment: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                },
                collected_by: {
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
              required: [
                "type",
                "collected_by"
              ],
            },
          },
          required: [
            "provider",
            "items",
            "quote",
            "payment",
          ],
        },
      },
      required: ["order"],
    },
  },
  required: ["context", "message"],
};
