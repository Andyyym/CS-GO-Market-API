## Getting Started

This API allows clients to search for items on the Steam market by item name and currency. It uses the Steam Community Market API to fetch data, and it also includes a caching mechanism and rate-limiting to improve performance and prevent abuse.

## Endpoint
```
GET /csgo-item/:itemName
```

## Parameters

- ``itemName`` (required) - The name of the item to search for.
- ``currency`` (optional) - The currency in which to return the prices. Defaults to USD.
- ``sort`` (optional) - The ability to sort requests by price in decending or ascending order. Defaults to asc

## Example Requests
```
GET /csgo-item/AK-47
```
```
GET /csgo-item/AK-47?currency=ZAR
```
```
GET /csgo-item/AK-47?currency=ZAR&sort=desc
```
## Example Response
```
[
    {
        "Name": "AK-47 | Redline (Field-Tested)",
        "USD": 11.65,
        "Listings": "7,976",
        "BuffURL": "https://api.pricempire.com/v1/redirectBuff/AK-47%20%7C%20Redline%20(Field-Tested)",
        "Image": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQh5hlcX0nvUOGsx8DdQBJjIAVHubSaKQZf0Qb1YXxqxAQJ3ZQ"
    },
    ...
]
```

## Caching

API results are cached for one hour (3600 seconds).

## Error handling

The API will return a 400 Bad Request status code and an error message if there's a problem with the request. This can happen if the item name is not provided, an = invalid currency is requested or any other error occurs during the processing of the request.

## Limitations

The API is rate-limited to 50 requests per IP per 15 minutes. If you exceed the limit, the API will return a 429 Too Many Requests status code and an error message.

## Local setup

- install the dependencies by running npm install
- you can run the API by running node .
- you can test the API by running http://localhost:3000/csgo-item/AK-47

## Deployment

You will need to deploy the code to a hosting service, a cloud service such as AWS, Azure, or Google Cloud, or you could use a service like Heroku or Zeit.
