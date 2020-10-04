const express = require("express");
const router = express.Router();

const {
  scrapeRetweetTwitter,
  getDream,
} = require("../controllers/DailyController");

router.get("/scrape", scrapeRetweetTwitter);
router.get("/getDream", getDream);

module.exports = router;
