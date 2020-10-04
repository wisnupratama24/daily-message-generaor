const getNextMaxId = (searchMetadata) =>
  searchMetadata.next_results
    ? searchMetadata.next_results.split("max_id=")[1].split("&")[0]
    : false;

exports.recursivelySearchTweets = async (client, maxId = null, count = 1) => {
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

exports.removeLink = (txt) => txt.split("https://")[0] || txt;

exports.chunkArray = (array, chunkBy) =>
  new Array(Math.ceil(array.length / chunkBy))
    .fill()
    .map((_) => array.splice(0, chunkBy));
