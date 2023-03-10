const express = require("express");
const request = require("request");
const cheerio = require("cheerio");

const Currency = "https://public-api.pricempire.com/api/meta/getCurrencyRates";
const Buff = "https://buff.163.com/market/csgo#tab=selling&page_num=1&search=";
const BaseURLSteam = 'https://steamcommunity.com/market/listings/730/'

const fetchItemsFromAPI = async (itemName, currency, sort) => {
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
                "div.market_listing_row"
              );

              getItems.each(function () {
                const name = $(this).find("span.market_listing_item_name").text();
                const price = $(this).find("span.sale_price").text();
                const img = $(this).find("img.market_listing_item_img").attr("src");
                const listings = $(this).find("span.market_listing_num_listings_qty").text();

                const newP = price.substring(1, price.length - 4);
                const newF = parseFloat(newP);
                const RoundedZar = Math.round(getRand * newF * 100) / 100;
                const spaces = name.split(" ").join("%20");

                const ItemSet = {
                  Name: name,
                  [currency]: RoundedZar,
                  Listings: listings,
                  SteamURL: BaseURLSteam + spaces,
                  BuffURL: Buff + spaces,
                  Image: img,
                };
                items.push(ItemSet);
              });

              if (sort === "desc") {
                items.sort((a, b) => b[currency] - a[currency]);
              } else if (sort === "asc") {
                items.sort((a, b) => a[currency] - b[currency]);
              }
              resolve(items);
            }
          }
        );
      }
    });
  });
};

module.exports = { fetchItemsFromAPI };
