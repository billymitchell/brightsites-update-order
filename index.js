
import fetch from 'node-fetch';
import {} from 'dotenv/config'

let inputData = {
    PO_Number: "(7400)-10-S1",
    Tracking_Number: "1Z4598130316369225",
    Shipping_Method: "UPS Ground",
    Ship_Date: "2019-10-20",
    Product_ID: "905669",
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
   

let currentStoreURL = storeMapping[storeID].URL
let currentAPI_KEY = storeMapping[storeID].API_KEY



    


async function getOrder() {

    let url = `${currentStoreURL}api/v2.3.0/orders/${orderID}?token=${currentAPI_KEY}`

    let response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        headers: {
            'Accept': 'application/json',
            },
        }).catch(err => {
            console.log(err)
        })

    return response.json()
    
}

// Get Order Data
const data = await getOrder()

//for each order item

// initialize items
let itemBeingShipped = ""

data.line_items.forEach(line_item   => {

        // console.log(line_item);
    
        // if the sku = input data sku 
        if (line_item.final_sku === inputData.SKU ){
    
            // set items
            itemBeingShipped = line_item.id

            return itemBeingShipped
        }
});



console.log(itemBeingShipped);

async function updateOrder() {

    let url = `${currentStoreURL}api/v2.3.0/orders/${orderID}/shipments?token=${currentAPI_KEY}`

    let response = await fetch(url, {
        method: 'POST',
        redirect: 'follow',
        headers: {
            // 'Accept': 'application/json',
            },
        body: {
            "shipment": {
                "tracking_number": inputData.Tracking_Number,
                "send_shipping_confirmation": true,
                "ship_date": inputData.Ship_Date,
                "note": "Lorem ipsum",
                "shipping_method": inputData.Shipping_Method,
                "line_items": [
                    {
                    "id": itemBeingShipped,
                    "quantity": inputData.Quantity
                    }
                ]
            }
        }
        }).then(response => {
            console.log(response);
        })
        .catch(err => {
            console.log(err)
        })    
}

await updateOrder()



// output = [
//   {
//     Request_Response: response,
//     Request_Error: err,
//   }
// ];


