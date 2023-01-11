const express = require("express");
const request = require("request");
const cheerio = require("cheerio");
const app = express();
const rateLimit = require("express-rate-limit");

const Currency = "https://public-api.pricempire.com/api/meta/getCurrencyRates";
const Buff = "https://api.pricempire.com/v1/redirectBuff/";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: "Too many requests, please try again later",
});

app.use(limiter);

const cache = new Map();
const CACHE_TIME = 3600 * 1000; // 1 hour in milliseconds

const fetchItemsFromAPI = async (itemName, currency) => {
  return new Promise((resolve, reject) => {
    request(Currency, function (error, response, body) {
      if (error) {
        reject(error);
      } else {
        const q = JSON.parse(body);
        const getRand = q[currency];

        request(
          `https://steamcommunity.com/market/search?appid=730&q=${itemName}`,
          function (error, response, body) {
            if (error) {
              reject(error);
            } else {
              const items = [];
              const $ = cheerio.load(body);

              const getItems = $(
                "div.market_listing_row.market_recent_listing_row.market_listing_searchresult"
              );

              getItems.each(function () {
                const name = $(this)
                  .find("span.market_listing_item_name")
                  .text();
                const price = $(this).find("span.sale_price").text();
                const img = $(this)
                  .find("img.market_listing_item_img")
                  .attr("src");
                const listings = $(this)
                  .find("span.market_listing_num_listings_qty")
                  .text();

                const newP = price.substring(1, price.length - 4);
                const newF = parseFloat(newP);
                const RoundedZar = Math.round(getRand * newF * 100) / 100;
                const spaces = name.replace(" ", "%20");
                const ItemSet = {
                  Name: name,
                  [currency]: RoundedZar,
                  Listings: listings,
                  BuffURL: Buff + spaces,
                  Image: img,
                };
                items.push(ItemSet);
              });
              resolve(items);
            }
          }
        );
      }
    });
  });
};

const getCacheData = (key) => {
  if (cache.has(key)) {
    const { value, timeoutId } = cache.get(key);
    clearTimeout(timeoutId);
    return value;
  }
  return null;
};

const setCacheData = (key, value) => {
  const timeoutId = setTimeout(() => {
    cache.delete(key);
  }, CACHE_TIME);
  cache.set(key, { value, timeoutId });
};

app.get("/csgo-item/:itemName", async (req, res) => {
  const itemName = req.params.itemName;
  const currency = req.query.currency || "USD"; //defaulting to USD

  // Check if the result is already in the cache
  const cacheData = getCacheData(`${itemName}${currency}`);
  if (cacheData) {
    res.json(cacheData);
    return;
  }

  const items = await fetchItemsFromAPI(itemName, currency);
  res.json(items);

  // set the result to cache
  setCacheData(`${itemName}${currency}`, items);
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
