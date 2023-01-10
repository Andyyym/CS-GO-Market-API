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

app.get("/csgo-item/:itemName", (req, res) => {
  const itemName = req.params.itemName;
  const Itmes = [];
  const currency = req.query.currency || "USD"; //defaulting to USD
  request(Currency, function (error, response, body) {
    const q = JSON.parse(body);
    const getRand = q[currency];

    request(
      `https://steamcommunity.com/market/search?appid=730&q=${itemName}`,
      function (error, response, body) {
        const $ = cheerio.load(body);

        const getItems = $(
          "div.market_listing_row.market_recent_listing_row.market_listing_searchresult"
        );

        getItems.each(function () {
          const name = $(this).find("span.market_listing_item_name").text();
          const price = $(this).find("span.sale_price").text();
          const img = $(this).find("img.market_listing_item_img").attr("src");
          const listings = $(this).find("span.market_listing_num_listings_qty").text()

          const newP = price.substring(1, price.length - 4);
          const newF = parseFloat(newP);
          const RoundedZar = Math.round(getRand * newF * 100) / 100;
          const spaces = name.replace(" ", "%20");
          const ItemSet = {
            Name: name,
            // USD: newF,
            [currency]: RoundedZar,
            Listings: listings,
            BuffURL: Buff + spaces,
            Image: img,
          };
          Itmes.push(ItemSet);
        });

        res.json(Itmes);
      }
    );
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
