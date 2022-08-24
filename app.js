
import fetch from 'node-fetch';
import {} from 'dotenv/config'
import testShipmentData from './testData.json';

/*Anything Inside A Parenthesis*/
const regExp = /\(([^)]+)\)/;


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

testShipmentData.mail_attachments.forEach(shipment => {

    // Pull Store ID from PO
    let storeID_Object = regExp.exec(shipment.customer_po);
    let storeID = storeID_Object[1]

    // Remove "{StoreID}-", "-S1"
    let orderID = shipment.customer_po.replace(`${storeID_Object[0]}-`, "").replace("-S1", "")

    // replace spaces with dashes
    let item_SKU = shipment.customer_po.replace(" ", "-")

    let currentStoreURL = storeMapping[storeID].URL
    let currentAPI_KEY = storeMapping[storeID].API_KEY

    // initialize item
    let itemBeingShippedID = ""

    // initialize order lookup data
    let orderLookupData = ""

    // lookup item id numbers
    async function orderLookup(orderID, currentStoreURL, currentAPI_KEY) {

        let url = `${currentStoreURL}api/v2.3.0/orders/${orderID}?token=${currentAPI_KEY}`

        let response = await fetch(url, {
            method: 'GET',
            redirect: 'follow',
            headers: {
                'Accept': 'application/json',
                },
            }).then(response => {
                // console.log(response);
            }).catch(err => {d
                // console.log(err)
            })
            orderLookupData = response.json()

        return orderLookupData
        
    }

    // Get Order Data
    orderLookup(orderID, currentStoreURL, currentAPI_KEY)

    console.log(orderLookupData);

    // orderLookupData.line_items.forEach(line_item   => {

    //         // console.log(line_item);
        
    //         // if the sku = input data sku 
    //         if (line_item.final_sku === item_SKU ){
        
    //             // set items
    //             itemBeingShippedID = line_item.id

    //             return itemBeingShippedID
    //         }
    // });

    // let updateOrderPayload = JSON.stringify({
    //     "shipment": {
    //       "tracking_number": shipment.tracking_number,
    //       "send_shipping_confirmation": true,
    //       "ship_date": shipment.shipment_date,
    //       "note": "Lorem ipsum",
    //       "shipping_method": shipment.shipping_method,
    //       "line_items": [
    //         {
    //           "id": itemBeingShipped,
    //           "quantity": shipment.quantity
    //         }
    //       ]
    //     }
    // });

    // async function updateOrder() {

    //     let url = `${currentStoreURL}api/v2.3.0/orders/${orderID}/shipments?token=${currentAPI_KEY}`
    
    //     let response = await fetch(url, {
    //         method: 'POST',
    //         redirect: 'follow',
    //         headers: {
    //             "Content-Type": "application/json"
    //             },
    //         body: updateOrderPayload,
    //         }).then(response => {
    //             console.log(response);
    //         })
    //         .catch(err => {
    //             console.log(err)
    //         })    
    // }
    
    // updateOrder()

    // return {
    // }

});


   






















// output = [
//   {
//     Request_Response: response,
//     Request_Error: err,
//   }
// ];
