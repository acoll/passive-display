const { createAxios } = require("./createAxios");
const qs = require("querystring");

const config = require("./config").mysportsfeeds;

const Authorization = `Basic ${Buffer.from(
  `${config.username}:${config.password}`
).toString("base64")}`;

function replaceAts(obj) {
  Object.keys(obj).forEach(key => {
    const child = obj[key];
    obj[key.replace(/^[@#]/, "")] = child;
    if (Array.isArray(child)) {
      child.forEach(replaceAts);
    }

    if (typeof child === "object") {
      replaceAts(child);
    }
  });
  return obj;
}

const api = createAxios({
  baseURL: "https://api.mysportsfeeds.com/v1.2/pull/",
  method: "GET",
  headers: { Authorization }
});

async function fullGameSchedule({
  league,
  season = "current",
  teams = ["bos"],
  date = "today"
}) {
  const query = { team: teams.join(","), date };
  const response = await api({
    url: `${league}/${season}/full_game_schedule.json?${qs.stringify(query)}`
  });

  return response.data.fullgameschedule;
}

async function conferenceTeamStandings({ league, season = "current" }) {
  const query = {};
  const response = await api({
    url: `${league}/${season}/conference_team_standings.json?${qs.stringify(
      query
    )}`
  });

  const standings = replaceAts(response.data.conferenceteamstandings);

  return standings;
}

async function gamePlayByPlay({
  league,
  season = "current",
  gameid = "20180302-DET-ORL"
}) {
  const query = { gameid };
  const response = await api({
    url: `${league}/${season}/game_playbyplay.json?${qs.stringify(query)}`
  });

  console.log(response.data);

  const standings = replaceAts(response.data.gameplaybyplay);

  standings.plays.play.forEach(play => {
    play.data = JSON.stringify(play);
  });

  return standings;
}

async function gameBoxscore({
  league,
  season = "current",
  gameid = "20180302-DET-ORL"
}) {
  const query = { gameid };
  const response = await api({
    url: `${league}/${season}/game_boxscore.json?${qs.stringify(query)}`
  });

  console.log(response.data);

  const standings = replaceAts(response.data.gameboxscore);

  return standings;
}

module.exports = {
  fullGameSchedule,
  conferenceTeamStandings,
  gamePlayByPlay,
  gameBoxscore
};
