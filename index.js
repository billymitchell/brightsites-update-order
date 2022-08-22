
import fetch from 'node-fetch';
import {} from 'dotenv/config'

let inputData = {
    PO_Number: "(7400)-9-S1",
    Tracking_Number: "1Z4598130316369225",
    Shipping_Method: "UPS Ground",
    Ship_Date: "2019-10-20",
    Product_ID: 905669,
    Quantity: 1,
    SKU: "Hidden Test Product "
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
        API_KEY: `${process.env.API_KEY_7400}`,
    },
    // 12345: {
    //     URL: "https://subdomain.mybrightsites.com",
    //     API_KEY: 1234,
    // },
}
   
console.log(storeMapping[7400].API_KEY);


let currentStoreURL = storeMapping[storeID].URL
let currentAPI_KEY = storeMapping[storeID].API_KEY


let shipmentData = [
    {
        "shipment": {
            "tracking_number": `${inputData.Tracking_Number}`,
            "send_shipping_confirmation": true,
            "ship_date": inputData.Ship_Date,
            "note": "Lorem ipsum",
            "shipping_method": `${inputData.Shipping_Method}`,
            "line_items": [
              {
                "id": inputData.Product_ID,
                "quantity": inputData.Quantity
              }
            ]
        }
    }
]
    


async function getOrder() {

    let url = `${currentStoreURL}api/v2.3.0/orders/${orderID}?token=${currentAPI_KEY}`

    let response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        headers: {
            'Accept': 'application/json',
            },
        })

    return response.json()
    
}

const data = await getOrder()

console.log(data.line_items)


data.line_items.forEach(line_item   => {
    // console.log(line_item.final_sku);
    // console.log(line_item.id);
    if (line_item.final_sku === inputData.SKU )
    console.log(line_item.id);
});





// fetch(`${currentStoreURL}api/v2.3.0/orders/${orderID}/shipments?token=${currentAPI_KEY}`, {
//     method: 'POST',
//     redirect: 'follow',
//     headers: {
//         'content-type': 'application/json',
//     },
//     body: JSON.stringify(shipmentData)
//     })
//     .then(response => {
//         console.log(response)
//     })
//     .then(result => {
//         console.log(result)
//     })
//     .catch(err => {
//         console.log(err)
// })


// output = [
//   {
//     Request_Response: response,
//     Request_Error: err,
//   }
// ];


