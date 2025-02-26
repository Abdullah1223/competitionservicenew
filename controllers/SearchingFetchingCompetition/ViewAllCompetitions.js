// const CompetitionManager = require("../../models/CompetitionSchema");
// const RedisManager = require("../../RedisConnection/RedisConnection");

// const ViewAllCompetitions = async (req, res) => {
//   const Categoryname = req.params.Categoryname.toLowerCase();
//   const { cursorid, pagenum } = req.params;
//   let Query = cursorid == 0 ? {} : { createdate: { $lt: cursorid } };
//   if (pagenum > 5) {
//     return res.status(204).send();
//   }
//   let Data;

//   if (Categoryname == "all") {
//     let cachekey = cursorid == 0 ? 0 : cursorid;
//     const CheckingForCache = await RedisManager.hget(
//       "viewallcompetitions/all",
//       `${cachekey}`
//     );
//     if (CheckingForCache != null) {
//       const parsing = JSON.parse(CheckingForCache);
//       console.log("Sending From Cache");
//       return res.status(200).send(parsing);
//     } else {
//       console.log(cursorid);
//       const FetchingCompetitions = await CompetitionManager.find(Query)
//         .sort({ createdate: -1 })
//         .select("title image genre description createdate deadline status")
//         .limit(4);
//       Data = FetchingCompetitions;
//       await RedisManager.multi()
//         .hset(
//           "viewallcompetitions/all",
//           `${cachekey}`,
//           JSON.stringify(FetchingCompetitions)
//         )
//         .expire("viewallcompetitions/all", 800)
//         .exec();
//       return Data.length > 0
//         ? res.status(200).json(Data)
//         : res.status(204).send();
//       //   return res.status(200).send(Data);
//     }
//   } else if (Categoryname == "live") {
//     let cachekey = cursorid == 0 ? 0 : cursorid;
//     const CheckingForCache = await RedisManager.hget(
//       "viewallcompetitions/live",
//       `${cachekey}`
//     );
//     if (CheckingForCache != null) {
//       const parsing = JSON.parse(CheckingForCache);
//       console.log("Sending From Cache");
//       return res.status(200).send(parsing);
//     } else {
//       const FetchingCompetitions = await CompetitionManager.find({
//         status: "started",
//         ...Query,
//       })
//         .sort({ createdate: -1 })
//         .select("title image genre createdate description deadline status")
//         .limit(4);
//       await RedisManager.multi()
//         .hset(
//           "viewallcompetitions/live",
//           `${cachekey}`,
//           JSON.stringify(FetchingCompetitions)
//         )
//         .expire("viewallcompetitions/live", 800)
//         .exec();
//       return FetchingCompetitions.length > 0
//         ? res.status(200).send(FetchingCompetitions)
//         : res.status(204).send();
//     }
//   } else if (Categoryname == "upcoming") {
//     let cachekey = cursorid == 0 ? 0 : cursorid;
//     const CheckingForCache = await RedisManager.hget(
//       "viewallcompetitions/upcoming",
//       `${cachekey}`
//     );
//     if (CheckingForCache != null) {
//       const parsing = JSON.parse(CheckingForCache);
//       console.log("Sending From Cache");
//       return res.status(200).send(parsing);
//     }else{

//     const FetchingCompetitions = await CompetitionManager.find({
//       status: "upcoming",...Query
//     })
//       .sort({ createdate: -1 })
//       .select("title image genre createdate description deadline status")
//       .limit(4);
//       await RedisManager.multi()
//       .hset(
//         "viewallcompetitions/upcoming",
//         `${cachekey}`,
//         JSON.stringify(FetchingCompetitions)
//       )
//       .expire("viewallcompetitions/upcoming", 800)
//       .exec();
//     return FetchingCompetitions.length > 0
//       ? res.status(200).send(FetchingCompetitions)
//       : res.status(204).send();
    
// }
//   } else {
//     let cachekey = cursorid == 0 ? 0 : cursorid;
//     const CheckingForCache = await RedisManager.hget(
//       `viewallcompetitions/${Categoryname}`,
//       `${cachekey}`
//     );
//     if (CheckingForCache != null) {
//       const parsing = JSON.parse(CheckingForCache);
//       console.log("Sending From Cache");
//       return res.status(200).send(parsing);
//     }else{
//     const FetchingCompetitions = await CompetitionManager.find({
//       genre: Categoryname,
//       ...Query
//     })
//       .sort({ createdate: -1 })
//       .select("title image genre createdate description deadline status")
//       .limit(4);
//       await RedisManager.multi()
//       .hset(
//         `viewallcompetitions/${Categoryname}`,
//         `${cachekey}`,
//         JSON.stringify(FetchingCompetitions)
//       )
//       .expire(`viewallcompetitions/${Categoryname}`, 800)
//       .exec();
//     return FetchingCompetitions.length > 0
//       ? res.status(200).send(FetchingCompetitions)
//       : res.status(204).send();
// }
// }
// };

// module.exports = ViewAllCompetitions;


const CompetitionManager = require("../../models/CompetitionSchema");
const RedisManager = require("../../RedisConnection/RedisConnection");
const handleError = (res, error, message = "An error occurred") => {
  console.error(message, error);
  return res.status(500).json({ error: message });
};

// Helper function to fetch data from MongoDB
const fetchCompetitionsFromDB = async (query, selectFields, sortField, limit) => {
  try {
    return await CompetitionManager.find(query)
      .sort(sortField)
      .select(selectFields)
      .limit(limit).lean();
  } catch (error) {
    throw error;
  }
};

// Helper function to fetch data from Redis or fallback to DB
const fetchCompetitions = async (cacheKey, query, selectFields, sortField, limit, res) => {
  try {
    // Check Redis cache
    const cachedData = await RedisManager.hget("viewallcompetitions", cacheKey);
    if (cachedData) {
      console.log("Sending From Cache");
      return res.status(200).send(JSON.parse(cachedData));
    }

    // Fetch from DB if not in cache
    const data = await fetchCompetitionsFromDB(query, selectFields, sortField, limit);
    if (data.length === 0) {
      return res.status(204).send();
    }

    // Cache the data in Redis
    await RedisManager.multi()
      .hset("viewallcompetitions", cacheKey, JSON.stringify(data) )
      .expire("viewallcompetitions", 800)
      .exec();

    return res.status(200).json(data);
  } catch (error) {
    handleError(res, error, "Failed to fetch competitions");
  }
};

// Main function to handle the request
const ViewAllCompetitions = async (req, res) => {
  const Categoryname = req.params.Categoryname.toLowerCase();
  const { cursorid, pagenum } = req.params;

  if (pagenum > 5) {
    return res.status(204).send();
  }

  const cacheKey = `${Categoryname}:${cursorid || 0}`;
  const query = cursorid == 0 ? {} : { createdate: { $lt: cursorid } };
  const selectFields = "title image genre description createdate deadline status";
  const sortField = { createdate: -1 };
  const limit = 4;

  try {
    switch (Categoryname) {
      case "all":
        await fetchCompetitions(cacheKey, query, selectFields, sortField, limit, res);
        break;

      case "live":
        await fetchCompetitions(
          cacheKey,
          { status: "started", ...query },
          selectFields,
          sortField,
          limit,
          res
        );
        break;

      case "upcoming":
        await fetchCompetitions(
          cacheKey,
          { status: "upcoming", ...query },
          selectFields,
          sortField,
          limit,
          res
        );
        break;

      default:
        await fetchCompetitions(
          cacheKey,
          { genre: Categoryname, ...query },
          selectFields,
          sortField,
          limit,
          res
        );
        break;
    }
  } catch (error) {
    handleError(res, error, "Failed to process request");
  }
};

module.exports = ViewAllCompetitions;