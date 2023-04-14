const _ = require("lodash");
const { isEqual, uniq } = _;

let parentKey = "";
let inside = false;
const getDiff = (oldData, newData) => {
  const data = uniq([...Object.keys(oldData), ...Object.keys(newData)]);
  const result = [];

  for (let i = 0; i < 6; i++) {
    parentKey=data[i];
    if (typeof oldData[data[i]] === "object") {
      const objDiff = getDiff(oldData[data[i]], newData[data[i]]);
      console.log(objDiff);
      result.push(`${parentKey}.${objDiff}`);
    } else {
      if (!isEqual(oldData[data[i]], newData[data[i]])) {
        result.push(data[i]);
       console.log(data[i]);
      }
    }
  }

  return result;
};

const oldData = {
  name: "Ashish Mahajn",
  address: {
    name: "481/7",
    building: "Rock building",
    locality: "Manohar Nagar",
    city: {
      name: "481/7",
      building: "Rock building",
    },
    state: "Haryana",
    country: "Europe",
    area_code: "122002",
  },
  tax_number: "29AAACU1901H1Z5",
  phone: "9578474599",
  email: "ashish@gmail.com",
  created_at: "2023-04-04T06:40:59.735Z",
  updated_at: "2023-04-04T06:40:59.735Z",
};

const newData = {
  name: "Ashish A",
  address: {
    name: "481/7",
    building: "Rock building",
    locality: "Manohara Nagar",
    city: {
      name: "3/7",
      building: "building",
    },
    state: "Haryana",
    country: "India",
    area_code: "122001",
  },
  tax_number: "29AAACU1901H1ZK",
  phone: "9578474599",
  email: "ashish@gmail.com",
};

console.log(getDiff(oldData, newData));
