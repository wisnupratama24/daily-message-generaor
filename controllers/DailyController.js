const Daily = require("../models/dailyModel");
const {
  chunkArray,
  recursivelySearchTweets,
  removeLink,
} = require("../config/twitterValidation");

// endpoint to get all the dreams in the database
exports.scrapeRetweetTwitter = async (request, response) => {
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
};

exports.getDream = async (request, response) => {
  const randomDb = await Daily.aggregate([{ $sample: { size: 1 } }]);
  return response.json({
    result: randomDb,
  });
};
