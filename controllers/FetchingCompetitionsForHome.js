const CompetitionManager = require("../models/CompetitionSchema");
const RedisManager = require("../RedisConnection/RedisConnection");

const FetchingCompetitionsForHome = async (req, res) => {
  try {
    const cacheKey = "competitions:home";
    
    const cachedData = await RedisManager.get(cacheKey);
    if (cachedData) {
      console.log("Sending from Cache");
      return res.status(200).json(JSON.parse(cachedData));
    }

    const UpcomingCompetitions = await CompetitionManager.find({
      status: "upcoming"
    })
      .sort({ createdate: -1 })
      .select("image title description startdate")
      .limit(4);

    const LiveCompetitions = await CompetitionManager.find({
      status: "started"
    })
      .sort({ createdate: -1 })
      .select("title description startdate genre prize entryFee")
      .limit(4);

    const Data = { UpcomingCompetitions, LiveCompetitions };

    
    await RedisManager.set(cacheKey, JSON.stringify(Data), "EX", 300);

    console.log("Sending from Database");
    res.status(200).json(Data);

  } catch (error) {
    console.error("Error fetching competitions:", error);
    res.status(500).json({ error: "Failed to fetch competitions" });
  }
};

module.exports = FetchingCompetitionsForHome;
