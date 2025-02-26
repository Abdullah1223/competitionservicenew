// const CompetitionManager = require("../models/CompetitionSchema");
// const CategoryManager = require("../models/CategorySchema");
// const UserManager = require("../models/UserSchema");
// const RedisManager = require("../RedisConnection/RedisConnection");
// const BrowseAllCompetitions = async (req, res) => {
//   try {
//     const { cursor, pagenum, totalCursorSaves, cursor_id } = req.params;
//     const currentuserid = req.body.user._id;
//    // console.log(currentuserid);
//     // console.log(req.params)
//     //console.log(cursor,pagenum,totalCursorSaves)

//     let Saved = [];
//     let DataToSend = [];
//     const CheckingForSavedCache = await RedisManager.exists(
//       `${currentuserid}savedlist`
//     );

//     if (CheckingForSavedCache) {
//      // console.log("Sending From Cache");
//       const GettingSavedCache = await RedisManager.get(
//         `${currentuserid}savedlist`
//       );
//       Saved = JSON.parse(GettingSavedCache);
//     } else {
//       const GettingSavedFromDatabase = await UserManager.findOne({
//         _id: currentuserid,
//       }).select("saved._id");
//       Saved = GettingSavedFromDatabase;
//       await RedisManager.set(
//         `${currentuserid}savedlist`,
//         JSON.stringify(GettingSavedFromDatabase)
//       );
//     }

//     if (cursor == 0) {
//       const CheckingForCache = await RedisManager.get(`browseallcompetitions/${cursor}`)
//       if(CheckingForCache!=null){
//        console.log('Sending Competitions From Cache')
//         const DataForSending  = JSON.parse(CheckingForCache)
//         return res.status(200).send(DataForSending)      
//       }else{
//         for (i = 1; i <= 2; i++) {
//           if (i == 1) {
//             const FetchedData = await CompetitionManager.find()
//               .sort({ createdate: -1 })
//               .limit(4)
//               .select("title image description startdate genre");
//             DataToSend.push({Saved:Saved.saved}, {
//               CategoryData: { CategoryName: "All" },
//               CompetitionData: FetchedData,
//               hasMore: false,
//             });
//           } else {
//             const FetchedData = await CompetitionManager.find({
//               status: "started",
//             })
//               .sort({ createdate: -1 })
//               .limit(4)
//               .select("title image description startdate genre");
//             if (FetchedData.length == 0) {
//               const FetchedData = await CompetitionManager.find({
//                 status: "upcoming",
//               })
//                 .sort({ createdate: -1 })
//                 .limit(4)
//                 .select("title image description startdate genre");
//               DataToSend.push({
//                 CategoryData: { CategoryName: "Upcoming" },
//                 CompetitionData: FetchedData,
//                 hasMore: false,
//               });
//             } else {
//               DataToSend.push( {
//                 CategoryData: { CategoryName: "Live" },
//                 CompetitionData: FetchedData,
//                 hasMore: false,
//               });
//             }
//           }
//         }
//       }
//      await RedisManager.set(`browseallcompetitions/${cursor}`,JSON.stringify(DataToSend),'EX',800) 
//       return res.status(200).send(DataToSend);
//     } else {
//       let DataForSending = [{Saved:Saved.saved}];
//       if (pagenum < 15) {
//         if (cursor == "Live" || cursor == "Upcoming" || cursor == "All") {
//           const FetchingData = await CategoryManager.find()
//             .sort({ totalSaves: -1, totalParticipants: -1 })
//             .limit(2);
//           for (const data of FetchingData) {
//             const FetchingCompetitionData = await CompetitionManager.find({
//               genre: data.Category_name,
//               $or: [{ status: "started" }, { status: "upcoming" }],
//             })
//               .sort({ status: -1, createdate: -1 })
//               .limit(4)
//               .select("title image description startdate genre");

//             DataForSending.push({
//               CategoryData: {
//                 CategoryName: data.Category_name,
//                 CategoryDataId: data._id,
//                 totalSaves: data.totalSaves,
//               },
//               CompetitionData: FetchingCompetitionData,
//             });
//           }
//           // console.log(DataForSending)
          
//           return res.status(200).send(DataForSending);
//         } else {
//           console.log('Else Worked')
//           const FetchingData = await CategoryManager.find()
//             .where({
//               $or: [
//                 {
//                   totalSaves: { $lt: totalCursorSaves },
//                 },
//                 {
//                   totalSaves: totalCursorSaves,
//                   _id: { $gt: cursor },
//                 },
//               ],
//             })
//             .sort({ totalSaves: -1, totalParticipants: -1 })
//             .limit(2);
//           //console.log(FetchingData)
//           if (FetchingData.length != 0) {
//             console.log("This is Length Check");
//             for (const data of FetchingData) {
//               const FetchingCompetitionData = await CompetitionManager.find({
//                 genre: data.Category_name,
//                 $or: [{ status: "started" }, { status: "upcoming" }],
//               })
//                 .sort({ status: -1, createdate: -1 })
//                 .limit(4)
//                 .select("title image description startdate genre");
//               DataForSending.push( {
//                 CategoryData: {
//                   CategoryName: data.Category_name,
//                   CategoryDataId: data._id,
//                   totalSaves: data.totalSaves,
//                 },
//                 CompetitionData: FetchingCompetitionData,
//               });
//             }
//             return res.status(200).send(DataForSending);
//           } else {
//             return res.status(204).send();
//           }
//         }
//       }
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

// module.exports = BrowseAllCompetitions;

// const CompetitionManager = require("../models/CompetitionSchema");
// const CategoryManager = require("../models/CategorySchema");
// const UserManager = require("../models/UserSchema");
// const RedisManager = require("../RedisConnection/RedisConnection");

// const BrowseAllCompetitions = async (req, res) => {
//   try {
//     const { cursor, pagenum, totalCursorSaves, cursor_id } = req.params;
//     const currentuserid = req.body.user._id;
    
//     // Fetch saved competitions from cache or database
//     let Saved = [];
//     const savedCacheKey = `${currentuserid}savedlist`;
//     const savedCacheExists = await RedisManager.exists(savedCacheKey);

//     if (savedCacheExists) {
//       const savedCache = await RedisManager.get(savedCacheKey);
//       Saved = JSON.parse(savedCache);
//     } else {
//       const user = await UserManager.findOne({ _id: currentuserid }).select("saved._id");
//       Saved = user;
//       await RedisManager.set(savedCacheKey, JSON.stringify(Saved), 'EX', 800); // Cache for 800 seconds
//     }

//     // Handle cursor-based pagination
//     if (cursor == 0) {
//       const cacheKey = `browseallcompetitions/${cursor}`;
//       const cachedData = await RedisManager.get(cacheKey);

//       if (cachedData) {
//         console.log('Sending Competitions From Cache');
//         return res.status(200).send(JSON.parse(cachedData));
//       }

//       // Fetch all and live/upcoming competitions in parallel
//       const [allCompetitions, liveCompetitions] = await Promise.all([
//         CompetitionManager.find()
//           .sort({ createdate: -1 })
//           .limit(4)
//           .select("title image description startdate genre"),
//         CompetitionManager.find({ status: "started" })
//           .sort({ createdate: -1 })
//           .limit(4)
//           .select("title image description startdate genre"),
//       ]);

//       const upcomingCompetitions = liveCompetitions.length === 0
//         ? await CompetitionManager.find({ status: "upcoming" })
//             .sort({ createdate: -1 })
//             .limit(4)
//             .select("title image description startdate genre")
//         : [];

//       const DataToSend = [
//         { Saved: Saved.saved },
//         {
//           CategoryData: { CategoryName: "All" },
//           CompetitionData: allCompetitions,
//           hasMore: false,
//         },
//         {
//           CategoryData: { CategoryName: liveCompetitions.length ? "Live" : "Upcoming" },
//           CompetitionData: liveCompetitions.length ? liveCompetitions : upcomingCompetitions,
//           hasMore: false,
//         },
//       ];

//       await RedisManager.set(cacheKey, JSON.stringify(DataToSend), 'EX', 800); // Cache for 800 seconds
//       return res.status(200).send(DataToSend);
//     } else {
//       let DataForSending = [{ Saved: Saved.saved }];

//       if (pagenum < 15) {
//         const categoryQuery = cursor === "Live" || cursor === "Upcoming" || cursor === "All"
//           ? {}
//           : {
//               $or: [
//                 { totalSaves: { $lt: totalCursorSaves } },
//                 { totalSaves: totalCursorSaves, _id: { $gt: cursor_id } },
//               ],
//             };
//          if(cursor=='Live' || cursor=='Upcoming' || cursor =="All"){
//           const CheckingForCache = await RedisManager.get(`browseallcompetitions/${1}`)
//           if(CheckingForCache!=null){
//             const Parsing = JSON.parse(CheckingForCache)
//             return res.status(200).send(Parsing)
//           }else{
//             const FetchingData = await CategoryManager.find(categoryQuery)
//             .sort({ totalSaves: -1, totalParticipants: -1 })
//             .limit(2);
  
//           if (FetchingData.length > 0) {
//             const competitionPromises = FetchingData.map(async (data) => {
//               const FetchingCompetitionData = await CompetitionManager.find({
//                 genre: data.Category_name,
//                 $or: [{ status: "started" }, { status: "upcoming" }],
//               })
//                 .sort({ status: -1, createdate: -1 })
//                 .limit(4)
//                 .select("title image description startdate genre");
  
//               return {
//                 CategoryData: {
//                   CategoryName: data.Category_name,
//                   CategoryDataId: data._id,
//                   totalSaves: data.totalSaves,
//                 },
//                 CompetitionData: FetchingCompetitionData,
//               };
//             });
  
//             const competitions = await Promise.all(competitionPromises);
//             DataForSending.push(...competitions);
//           }
//          await RedisManager.set(`browseallcompetitions/${1}`,JSON.stringify(DataForSending),'EX',800)
//           return FetchingData.length > 0
//             ? res.status(200).send(DataForSending)
//             : res.status(204).send();
//            }
//          }else{
//            const CheckingForCache = await RedisManager.get(`browseallcompetitions/${cursor}/${totalCursorSaves}/${pagenum}`)
//            const FetchingData = await CategoryManager.find(categoryQuery)
//            .sort({ totalSaves: -1, totalParticipants: -1 })
//            .limit(2);
 
//          if (FetchingData.length > 0) {
//            const competitionPromises = FetchingData.map(async (data) => {
//              const FetchingCompetitionData = await CompetitionManager.find({
//                genre: data.Category_name,
//                $or: [{ status: "started" }, { status: "upcoming" }],
//              })
//                .sort({ status: -1, createdate: -1 })
//                .limit(4)
//                .select("title image description startdate genre");
 
//              return {
//                CategoryData: {
//                  CategoryName: data.Category_name,
//                  CategoryDataId: data._id,
//                  totalSaves: data.totalSaves,
//                },
//                CompetitionData: FetchingCompetitionData,
//              };
//            });
 
//            const competitions = await Promise.all(competitionPromises);
//            DataForSending.push(...competitions);
//          }
//         await RedisManager.set(`browseallcompetitions/${cursor}/${totalCursorSaves}/${pagenum}`,JSON.stringify(DataForSending),'EX',800)
//          return FetchingData.length > 0
//            ? res.status(200).send(DataForSending)
//            : res.status(204).send();

//          } 
      
//       }
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// };

// module.exports = BrowseAllCompetitions;

const CompetitionManager = require("../models/CompetitionSchema");
const CategoryManager = require("../models/CategorySchema");
const UserManager = require("../models/UserSchema");
const RedisManager = require("../RedisConnection/RedisConnection");

const BrowseAllCompetitions = async (req, res) => {
  try {
    const { cursor, pagenum, totalCursorSaves, cursor_id } = req.params;
    const currentuserid = req.body.user._id;

    // 🔹 Fetch saved competitions from Redis (if exists)
    const savedCacheKey = `${currentuserid}savedlist`;
    const pipeline = RedisManager.pipeline();
    pipeline.get(savedCacheKey);
    pipeline.exists(savedCacheKey);
    
    const redisResults = await pipeline.exec();
    
    // Extract values properly
    const savedCache = redisResults[0][1];  // First query result
    const savedCacheExists = redisResults[1][1];  // Second query result
    
    let Saved = null;
    
    if (savedCacheExists && savedCache) {
      try {
        Saved = JSON.parse(savedCache); // ✅ Safely parse JSON
      } catch (error) {
        console.error("Error parsing saved cache:", error);
        Saved = null; // Reset in case of malformed data
      }
    }

    if (!Saved) {
      const user = await UserManager.findOne({ _id: currentuserid }).select("saved._id");
      Saved = user?.saved || [];
      await RedisManager.set(savedCacheKey, JSON.stringify(Saved), 'EX', 800);
    }

    // 🔹 Cursor-based pagination handling
    if (cursor == 0) {
      const cacheKey = `browseallcompetitions/${cursor}`;
      const cachedData = await RedisManager.get(cacheKey);

      if (cachedData) {
        try {
          console.log('Sending Competitions From Cache');
          return res.status(200).send(JSON.parse(cachedData));
        } catch (error) {
          console.error("Error parsing cached competition data:", error);
        }
      }

      // Fetch competitions in parallel
      const [allCompetitions, liveCompetitions] = await Promise.all([
        CompetitionManager.find().sort({ createdate: -1 }).limit(4)
          .select("title image description startdate genre"),
        CompetitionManager.find({ status: "started" }).sort({ createdate: -1 }).limit(4)
          .select("title image description startdate genre"),
      ]);

      const upcomingCompetitions = liveCompetitions.length === 0
        ? await CompetitionManager.find({ status: "upcoming" }).sort({ createdate: -1 }).limit(4)
          .select("title image description startdate genre")
        : [];

      const DataToSend = [
        { Saved },
        {
          CategoryData: { CategoryName: "All" },
          CompetitionData: allCompetitions,
          hasMore: false,
        },
        {
          CategoryData: { CategoryName: liveCompetitions.length ? "Live" : "Upcoming" },
          CompetitionData: liveCompetitions.length ? liveCompetitions : upcomingCompetitions,
          hasMore: false,
        },
      ];

      await RedisManager.set(cacheKey, JSON.stringify(DataToSend), 'EX', 800);
      return res.status(200).send(DataToSend);
    }

    // 🔹 Handling paginated fetching
    let DataForSending = [{ Saved }];
    if (pagenum < 15) {
      const categoryQuery = cursor === "Live" || cursor === "Upcoming" || cursor === "All"
        ? {}
        : {
            $or: [
              { totalSaves: { $lt: totalCursorSaves } },
              { totalSaves: totalCursorSaves, _id: { $gt: cursor_id } },
            ],
          };

      const cacheKey = cursor === "Live" || cursor === "Upcoming" || cursor === "All"
        ? `browseallcompetitions/1`
        : `browseallcompetitions/${cursor}/${totalCursorSaves}/${pagenum}`;

      const CheckingForCache = await RedisManager.get(cacheKey);
      if (CheckingForCache) {
        try {
          return res.status(200).send(JSON.parse(CheckingForCache));
        } catch (error) {
          console.error("Error parsing paginated competition data:", error);
        }
      }

      const FetchingData = await CategoryManager.find(categoryQuery)
        .sort({ totalSaves: -1, totalParticipants: -1 })
        .limit(2)
        .select("Category_name _id totalSaves");

      if (FetchingData.length > 0) {
        const competitionPromises = FetchingData.map(async (data) => {
          const FetchingCompetitionData = await CompetitionManager.find({
            genre: data.Category_name,
            $or: [{ status: "started" }, { status: "upcoming" }],
          })
            .sort({ status: -1, createdate: -1 })
            .limit(4)
            .select("title image description startdate genre");

          return {
            CategoryData: {
              CategoryName: data.Category_name,
              CategoryDataId: data._id,
              totalSaves: data.totalSaves,
            },
            CompetitionData: FetchingCompetitionData,
          };
        });

        const competitions = await Promise.all(competitionPromises);
        DataForSending.push(...competitions);
      }

      await RedisManager.set(cacheKey, JSON.stringify(DataForSending), 'EX', 800);
      return FetchingData.length > 0
        ? res.status(200).send(DataForSending)
        : res.status(204).send();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = BrowseAllCompetitions;
