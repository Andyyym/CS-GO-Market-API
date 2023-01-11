## CSGO Item API

This API allows clients to search for items on the Steam market by item name and currency. The results include the item's name, price in the specified currency, number of listings, an image, and a link to the item on Steam.

## Endpoint
```
GET /csgo-item/:itemName
```

## Query Parameters

- `itemName:` The name of the item to search for.
- `currency (optional):` The currency to use for the price. Defaults to USD.

## Responses

Success

Status: 200 OK

The response will be a JSON object containing an array of items that match the search criteria. Each item includes:

- `Name:` The name of the item.
- `[currency]:` The price of the item in the specified currency.
- `Listings:` The number of listings for the item on Steam.
- `BuffURL:` A link to the item on Steam.
- `Image:` A link to the image of the item.

Error

Status: 400 Bad Request

If the request is invalid, the API will return a JSON object with an error field containing a description of the error.

## Example
```
GET /csgo-item/AK-47
```
```
GET /csgo-item/AK-47?currency=ZAR
```

## Implementation

- To implement this API into your own code, you will need to:
- Install the necessary dependencies by running npm install express request cheerio express-rate-limit in your project's root directory.
- Copy the code provided in this document into a new file, server.js or any other name you prefer.
- Run the API by executing node server.js in your terminal.
- You should now be able to make requests to the API by sending GET requests to http://localhost:3000/csgo-item/[itemName] with the desired itemName and currency as query parameters.
