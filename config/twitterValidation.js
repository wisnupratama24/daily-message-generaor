const Twitter = require("twitter-lite");

const user = new Twitter({
  subdomain: "api", // "api" is the default (change for other subdomains)
  version: "1.1", // version "1.1" is the default (change for other subdomains)
  consumer_key: process.env.TWITTER_API_KEY, // from Twitter.
  consumer_secret: process.env.TWITTER_API_SECRET, // from Twitter.
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

module.exports = user;
