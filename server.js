const fs = require("fs");
const Daily = require("./models/dailyModel");
const express = require("express");
const bodyParser = require("body-parser");
const Twitter = require("twitter-lite");
const connectDB = require("./config/db");

require("dotenv").config({
  path: ".env",
});
connectDB();

const user = new Twitter({
  subdomain: "api", // "api" is the default (change for other subdomains)
  version: "1.1", // version "1.1" is the default (change for other subdomains)
  consumer_key: process.env.TWITTER_API_KEY, // from Twitter.
  consumer_secret: process.env.TWITTER_API_SECRET, // from Twitter.
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

const getNextMaxId = (searchMetadata) =>
  searchMetadata.next_results
    ? searchMetadata.next_results.split("max_id=")[1].split("&")[0]
    : false;

const recursivelySearchTweets = async (client, maxId = null, count = 1) => {
  const { statuses, search_metadata } = await client.get(`search/tweets`, {
    q: "https://twitter.com/handokotjung/status/1294462465586032641",
    count: 100,
    max_id: maxId,
    include_entities: true,
    tweet_mode: "extended",
  });
  console.log("meta", search_metadata);
  const next = getNextMaxId(search_metadata);
  if (next) {
    const filtered = statuses.filter(
      (s) =>
        !s.retweeted_status || s.quoted_status_id_str === "1294462465586032641"
    );
    console.log(next, count, filtered.length);
    return [
      ...filtered,
      ...(await recursivelySearchTweets(client, next, count + 1)),
    ];
  } else {
    console.log("result length", statuses.length);
    return statuses;
  }
};

const removeLink = (txt) => txt.split("https://")[0] || txt;

const chunkArray = (array, chunkBy) =>
  new Array(Math.ceil(array.length / chunkBy))
    .fill()
    .map((_) => array.splice(0, chunkBy));

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));

// endpoint to get all the dreams in the database
app.get("/scrape", async (request, response) => {
  try {
    const r = await user.getBearerToken();
    const client = new Twitter({
      bearer_token: r.access_token,
    });
    const statuses = await recursivelySearchTweets(client);
    const chunks = chunkArray(statuses, 5);
    for (const chunk of chunks) {
      const placeholders = chunk.forEach((s) => {
        const newItem = {
          id_str: s.id_str,
          dream: removeLink(s.full_text),
          permalink: `https://twitter.com/${s.user.screen_name}/status/${s.id_str}`,
          screenName: s.user.screen_name,
          name: s.user.name,
          image: s.user.profile_image_url_https,
          retweetCount: s.retweet_count,
          favCount: s.favorite_count,
        };

        Daily.create(newItem);
      });
    }
    response.send({ message: "done" });
  } catch (err) {
    response.send({});
  }
});

app.get("/getDream", async (request, response) => {
  const randomDb = await Daily.aggregate([{ $sample: { size: 1 } }]);
  return response.json({
    result: randomDb,
  });
});

var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
