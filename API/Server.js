const express = require("express");
const rateLimit = require("express-rate-limit");
const app = express();
const { fetchItemsFromAPI } = require("./API");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: "Too many requests, please try again later",
});

app.use(limiter);

const cache = new Map();
const CACHE_TIME = 3600 * 1000; // 1 hour in milliseconds

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
  try {
    const itemName = req.params.itemName;
    const currency = req.query.currency || "USD"; //defaulting to USD
    const sort = req.query.sort || "asc";
    // Check if the result is already in the cache
    const cacheData = getCacheData(`${itemName}${currency}${sort}`);
    if (cacheData) {
      res.json(cacheData);
      return;
    }

    let items = await fetchItemsFromAPI(itemName, currency, sort);
    res.json(items);

    // set the result to cache
    setCacheData(`${itemName}${currency}${sort}`, items);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong, please try again later.");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
