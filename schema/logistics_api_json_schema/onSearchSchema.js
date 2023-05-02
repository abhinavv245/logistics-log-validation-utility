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
            const:"on_search"
           
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
          catalog: {
            type: "object",
            properties: {
              "bpp/fulfillments": {
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
                        enum: ["Prepaid", "CoD", "RTO", "Reverse QC"],
                      },
                    },
                    required: ["id", "type"],
                  },
                
              },
              "bpp/descriptor": {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                  },
                },
                required: ["name"],
              },
              "bpp/providers": {
                type: "array",
                items: 
                  {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                      },
                      descriptor: {
                        type: "object",
                        properties: {
                          name: {
                            type: "string",
                          },
                          short_desc: {
                            type: "string",
                          },
                          long_desc: {
                            type: "string",
                          },
                        },
                        required: ["name", "short_desc", "long_desc"],
                      },
                      categories: {
                        type: "array",
                        items: 
                          {
                            type: "object",
                            properties: {
                              id: {
                                type: "string",
                              },
                              time: {
                                type: "object",
                                properties: {
                                  label: {
                                    type: "string",
                                  },
                                  duration: {
                                    type: "string",
                                  },
                                },
                                required: ["label", "duration"],
                              },
                            },
                            required: ["id"],
                          },
                        
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
                              gps: {
                                type: "string",
                              },
                              address: {
                                type: "object",
                                properties: {
                                  street: {
                                    type: "string",
                                  },
                                  city: {
                                    type: "string",
                                  },
                                  area_code: {
                                    type: "string",
                                  },
                                  state: {
                                    type: "string",
                                  },
                                },
                                required: [
                                  "street",
                                  "city",
                                  "area_code",
                                  "state",
                                ],
                              },
                            },
                            required: [],
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
                              parent_item_id: {
                                type: "string",
                              },
                              category_id: {
                                type: "string",
                              },
                              fulfillment_id: {
                                type: "string",
                              },
                              descriptor: {
                                type: "object",
                                properties: {
                                  code: {
                                    type: "string",
                                    enum:["P2P","P2H2P"]
                                  },
                                  name: {
                                    type: "string",
                                  },
                                  short_desc: {
                                    type: "string",
                                  },
                                  long_desc: {
                                    type: "string",
                                  },
                                },
                                required: [
                                  "code",
                                  "name",
                                  "short_desc",
                                  "long_desc",
                                ],
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
                              time: {
                                type: "object",
                                properties: {
                                  label: {
                                    type: "string",
                                  },
                                  duration: {
                                    type: "string",
                                  },
                                  timestamp: {
                                    type: "string",
                                    format: "date-time" 
                                  },
                                },
                                required: ["label", "duration", "timestamp"],
                              },
                            },
                            required: [
                              "id",
                              "category_id",
                              "fulfillment_id",
                              "descriptor",
                              "price",
                            ],
                          },
                        
                      },
                    },
                    required: [
                      "id",
                      "descriptor",
                      "categories",
                      "items",
                    ],
                  },
                
              },
            },
            required: ["bpp/fulfillments", "bpp/descriptor", "bpp/providers"],
          },
        },
        required: ["catalog"],
      },
    },
    required: ["context", "message"],
  };
  