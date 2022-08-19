
import fetch from 'node-fetch';

let inputData = {
    PO_Number: "(7400)-9-S1",
    Tracking_Number: "1Z4598130316369225",
    Shipping_Method: "UPS Ground",
    Ship_Date: "2019-10-20",
}


/*Anything Inside A Parenthesis*/
const regExp = /\(([^)]+)\)/;

// Pull Store ID from PO
let storeID_Object = regExp.exec(inputData.PO_Number);
let storeID = storeID_Object[1]

// Remove "{StoreID}-", "-S1"
let orderID = inputData.PO_Number.replace(`${storeID_Object[0]}-`, "").replace("-S1", "")


const storeMapping = {
    7400: {
        URL: "https://fbla.mybrightsites.com/",
        API_KEY: "Removed",
    },
    // 12345: {
    //     URL: "https://subdomain.mybrightsites.com",
    //     API_KEY: 1234,
    // },
}
   

let currentStoreURL = storeMapping[storeID].URL
let currentAPI_KEY = storeMapping[storeID].API_KEY


fetch(`${currentStoreURL}api/v2.3.0/orders/${orderID}/shipments?token=${currentAPI_KEY}`, {
    method: 'POST',
    mode: 'cors',
    cache: 'cache',
    credentials: 'same-origin',
    headers: {
        'content-type': 'application/json',
        // authorization: 'Bearer 123abc456def'
    },
        body: {
            "shipment": {
              "tracking_number": `${inputData.Tracking_Number}`,
              "send_shipping_confirmation": true,
              "ship_date": `${inputData.Ship_Date}`,
              "shipping_method": `${inputData.Shipping_Method}`,
            }
          }
    })
    .then(response => {
        console.log(response)
    })
    .catch(err => {
        console.log(err)
})

// output = [
//   {
//     Request_Response: response,
//     Request_Error: err,
//   }
// ];


