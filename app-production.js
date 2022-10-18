const storeMapping = {
  7400: {
    URL: 'https://fbla.mybrightsites.com/',
    API_KEY: `${process.env.API_KEY_7400}`,
  },
  // 12345: {
  //     URL: "https://subdomain.mybrightsites.com",
  //     API_KEY: 1234,
  // },
};

// for each shipment item
JSON.parse(inputData.mailparser).mail_attachments.forEach((shipment) => {
  let splitPO = shipment.customer_po.split('-');

  let Store_Abbreviation = splitPO[0];
  let Store_ID = splitPO[1];
  let Order_ID = splitPO[2];
  let Orderdesk_Split_Order_ID = splitPO[3];

  //   let splitDate = shipment.shipment_date.split('-');
  //   let shipmentMonth = splitDate[0];
  //   let shipmentDay = splitDate[1];
  //   let shipmentYear = `20${splitDate[2]}`;
  //   let formattedShipmentDate = `${shipmentYear}-${shipmentMonth}-${shipmentDay}`;

  // Replace spaces with dashes in SKUs
  let shipment_SKU_Dashes = shipment.stock_item.replace(/\s+/g, '-');

  // if Store_ID only contains numbers
  if (/^\d+$/.test(Store_ID)) {
    // if there is a matching store
    if (storeMapping[Store_ID]) {
      // 7400

      let currentStoreURL = storeMapping[Store_ID].URL;
      // https://fbla.mybrightsites.com/

      let currentAPI_KEY = storeMapping[Store_ID].API_KEY;
      // api key

      //Lookup order using order ID
      async function orderLookup(Order_ID, currentStoreURL, currentAPI_KEY) {
        let url = `${currentStoreURL}api/v2.3.0/orders/${Order_ID}?token=${currentAPI_KEY}`;

        let response = await fetch(url, {
          method: 'GET',
          redirect: 'follow',
          headers: {
            Accept: 'application/json',
          },
        });
        // // if error
        if (!response.ok) {
          console.log('Response Status Not Okay: ', response);
          // if no error
        }
        if (response.ok) {
          // set json to data
          let data = await response.json();
          return data;
        }
      }

      async function getOrderData() {
        // initialize order data
        let orderLookupData = '';
        // initialize item

        orderLookupData = await orderLookup(
          Order_ID,
          currentStoreURL,
          currentAPI_KEY
        );

        // for each order item
        orderLookupData.line_items.forEach((item_in_order) => {
          // if the item sku form the order looked up in Brightsites matches sku submitted with tacking
          if (item_in_order.final_sku === shipment_SKU_Dashes) {
            let updateOrderPayload = JSON.stringify({
              shipment: {
                tracking_number: shipment.tracking_number,
                send_shipping_confirmation: true,
                ship_date: shipment.shipment_date,
                note: 'Updated Via Edwards Shipment Doc Through Centricity API',
                shipping_method: shipment.shipping_method,
                line_items: [
                  {
                    id: item_in_order.id,
                    quantity: Math.round(shipment.item_qty),
                  },
                ],
              },
            });

            async function updateOrder() {
              let url = `${currentStoreURL}api/v2.3.0/orders/${Order_ID}/shipments?token=${currentAPI_KEY}`;

              let response = await fetch(url, {
                method: 'POST',
                redirect: 'follow',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: updateOrderPayload,
              });
              // // if error
              if (!response.ok) {
                console.log(
                  `Response Status Not Okay. Item ID: ${item_in_order.id}, Shipment Tracking #: ${shipment.tracking_number}, BODY:`,
                  response
                );
                // if no error
              }
              if (response.ok) {
                console.log(
                  `Item Shipping Updated ${item_in_order.id} with tracking number ${shipment.tracking_number}`
                );
              }
            }

            updateOrder();
          } else {
            console.log(
              item_in_order.final_sku,
              'Does Not Match',
              shipment_SKU_Dashes,
              shipment
            );
          }
        });
      }

      getOrderData();
    }
    // if there is no store that matches the Store ID in the PO number
    else {
      console.error('Store_ID does not match any stores: ', Store_ID, shipment);
    }
  }
  // for each order with no store id in parentheses the PO number
  else {
    console.error(
      'Store_ID is not valid, it contains a letter: ',
      Store_ID,
      shipment
    );
  }
});

output = {
  status: 'successfully executed to the end',
};
