const CompetitionManager = require('../../models/CompetitionSchema');
const RedisManager = require('../../RedisConnection/RedisConnection');

const SearchingCompetitions = async (req, res) => {
  console.log('Searching Hit')
  const SearchQuery = req.params.SearchQuery?.trim().toLowerCase(); // Get the search query and normalize it
  if (!SearchQuery) {
    return res.status(400).send({ error: 'Search query is required' });
  }

  try {
    const regex = new RegExp(SearchQuery.replace(/\s+/g, '.*'), 'i'); 
    const results = await CompetitionManager.find({
      title: { $regex: regex },
    });

    if (results.length === 0) {
      return res.status(200).send({ message: 'No competitions found'});
    }

    return res.status(200).send({ data: results });
  } catch (error) {
    console.error('Error in SearchCompetitions:', error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
};

module.exports = SearchingCompetitions;
