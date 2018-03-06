import { h } from "preact";
import { Section } from "./section";
import styled from "styled-components";
import { format } from "date-fns";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";
import styles from "./games";

function formatGameTime(dt) {
  return format(new Date(dt * 1000), "h:mmA");
}

const GameStyles = styled.div`
  display: grid;
  grid-row-gap: 1vh;

  .row {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    grid-column-gap: 1vw;
  }
`;

export function TodaysGames({ games }) {
  return (
    <Section title="Today's Games">
      <GameStyles>
        {games.length === 0 ? (
          <h3>No Games Today 😞</h3>
        ) : (
          games.map(game => {
            return (
              <div className="row">
                <h3>{game.time}</h3>
                <hr />
                <h3>
                  {game.homeTeam.Name} vs {game.awayTeam.Name}
                </h3>
              </div>
            );
          })
        )}
      </GameStyles>
    </Section>
  );
}

function standingsList(standings, conference) {
  return standings.map((standing, index) => (
    <div class={styles.standings} style={{ opacity: index >= 8 ? 0.5 : 1 }}>
      <h3>{standing.team.Name}</h3>
      <h3>{standing.stats.GamesBack.text}</h3>
    </div>
  ));
}

const STANDINGS_QUERY = gql`
  query {
    mySportsFeeds {
      conference_team_standings {
        conference {
          name
          teamentry {
            rank
            stats {
              GamesBack {
                text
              }
            }
            team {
              Name
            }
          }
        }
      }
    }
  }
`;

export function Standings() {
  return (
    <Query query={STANDINGS_QUERY}>
      {({ loading, error, data }) => {
        return (
          <Section title="NBA Standings">
            <div class={styles.standings}>
              {loading ? (
                <span>Loading...</span>
              ) : (
                data.mySportsFeeds.conference_team_standings.conference.map(
                  conference => (
                    <div>
                      {standingsList(conference.teamentry, conference.name)}
                    </div>
                  )
                )
              )}
            </div>
          </Section>
        );
      }}
    </Query>
  );
}

const GAME_SUMMARY_QUERY = gql`
  query {
    mySportsFeeds {
      # game_playbyplay {
      #   plays {
      #     play {
      #       time
      #       quarter
      #       data
      #     }
      #   }
      # }
      game_boxscore {
        lastUpdatedOn
        quarterSummary {
          quarterTotals {
            homeScore
            awayScore
          }
          quarter {
            number
            scoring {
              scoringPlay {
                time
                teamAbbreviation
                playDescription
              }
            }
          }
        }
        game {
          awayTeam {
            Name
          }
          homeTeam {
            Name
          }
        }
      }
    }
  }
`;

function formatQuarter(num) {
  switch (num) {
    case 1:
      return "1st";
    case 2:
      return "2nd";
    case 3:
      return "3rd";
    case 4:
      return "4th";
  }
}

export function LiveGame() {
  return (
    <Query query={GAME_SUMMARY_QUERY}>
      {({ loading, error, data }) => {
        if (loading) {
          return "loading...";
        }

        const game = data.mySportsFeeds.game_boxscore.game;
        const totals =
          data.mySportsFeeds.game_boxscore.quarterSummary.quarterTotals;

        const quarters =
          data.mySportsFeeds.game_boxscore.quarterSummary.quarter;
        const quarter = quarters[quarters.length - 1];
        const plays = quarter.scoring.scoringPlay.slice(-5);

        const latestPlay = plays[plays.length - 1];

        const [minutes, seconds] = latestPlay.time.split(":");
        const timeLeft = 12 - minutes - seconds / 60;
        const timeLeftStr = `${Math.floor(timeLeft)}:${Math.floor(
          60 * (timeLeft - Math.floor(timeLeft))
        )}`;

        return (
          <Section
            title={`Live Game - ${game.awayTeam.Name} vs ${game.homeTeam.Name}`}
          >
            <div class={styles.live_game}>
              <div>
                {game.homeTeam.Name}{" "}
                <span class={styles.live_game_team_record}>(20-10)</span>
              </div>
              <div>{totals.homeScore}</div>
              <div>{formatQuarter(quarter.number)}</div>
            </div>
            <div class={styles.live_game}>
              <div>
                {game.awayTeam.Name}{" "}
                <span class={styles.live_game_team_record}>(20-10)</span>
              </div>
              <div>{totals.awayScore}</div>
              <div>{timeLeftStr}</div>
            </div>
            <hr />
            {plays.map(play => (
              <div class={styles.live_game_play}>
                <div>{play.playDescription.replace(/\[.+\]/, "")}</div>
                <div>{play.time}</div>
              </div>
            ))}
          </Section>
        );
      }}
    </Query>
  );
}
