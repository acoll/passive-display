const { makeExecutableSchema } = require("graphql-tools");
const fs = require("fs");
const { forecast } = require("../apis/darksky");
const mySportsFeeds = require("../apis//mysportsfeeds");
const { listCalendarEvents } = require("../apis//calendar");
const { fetchListsForUser, fetchListStatuses } = require("../apis//twitter.js");
const path = require("path");

const typeDefs = ["schema", "darksky", "mysportsfeeds", "events", "twitter"]
  .map(name =>
    fs.readFileSync(path.join(__dirname, `${name}.graphql`), {
      encoding: "UTF8"
    })
  )
  .join("\n\n");

const resolvers = {
  Query: {
    forecast(_, { lat = 42.8123149, long = -72.0290386, time }, context, info) {
      const forecastField = info.fieldNodes[0];
      const fields = forecastField.selectionSet.selections.map(
        field => field.name.value
      );
      return forecast({ lat, long, time, fields });
    },
    mySportsFeeds: () => mySportsFeeds,
    async events(_, args, { userId }) {
      const result = await listCalendarEvents(userId);
      return result;
    },
    async twitterLists(_, args, { userId }) {
      return fetchListsForUser(userId);
    }
  },
  MySportsFeeds: {
    full_game_schedule(mySportsFeeds, { date }) {
      return mySportsFeeds.fullGameSchedule({
        league: "nba",
        date
      });
    },
    conference_team_standings() {
      return mySportsFeeds.conferenceTeamStandings({ league: "nba" });
    },
    game_playbyplay() {
      return mySportsFeeds.gamePlayByPlay({ league: "nba" });
    },
    game_boxscore() {
      return mySportsFeeds.gameBoxscore({ league: "nba" });
    }
  },
  TwitterList: {
    statuses(list, { count }) {
      return fetchListStatuses(list.id_str, count);
    }
  }
};

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers
});
