import { h } from "preact";
import { Today } from "../components/today";
import { CalendarDay } from "../components/calendar";
import { Standings } from "../components/sports";
import { TwitterList } from "../components/twitter";
import { gql } from "apollo-boost";
import { Query, ApolloProvider } from "react-apollo";
import { addDays, isSameDay, eachDayOfInterval, parse } from "date-fns";
import styles from "./dashboard.css";
import { getClient } from "../lib/apolloClient";

const LOAD_DATA = gql`
  query {
    mySportsFeeds {
      full_game_schedule(date: "from-today-to-6-days-from-now") {
        gameentry {
          time
          date
          awayTeam {
            Name
          }
          homeTeam {
            Name
          }
        }
      }
    }
    events {
      summary
      start
      end
    }
    forecast {
      currently {
        summary
        temperature
      }
      daily {
        summary
        data {
          time
          summary
          temperatureHigh
          temperatureLow
          sunsetTime
          sunriseTime
        }
      }
    }
  }
`;

export default function Dashboard({ id = "?" }) {
  return (
    <ApolloProvider client={getClient(id)}>
      <Query query={LOAD_DATA}>
        {({ loading, error, data }) => {
          if (loading) {
            return <h1>LOADING</h1>;
          }

          if (error) {
            console.error(error);
          }

          console.log(data);

          const today = new Date();
          const range = eachDayOfInterval({
            start: addDays(today, 1),
            end: addDays(today, 5)
          });

          const events = data.events.map(event => ({
            ...event,
            start: new Date(event.start * 1000),
            end: new Date(event.end * 1000)
          }));

          const games = data.mySportsFeeds.full_game_schedule.gameentry.map(
            game => ({
              ...game,
              date: parse(
                `${game.date} ${game.time}`,
                "YYYY-MM-DD h:mmA",
                new Date()
              )
            })
          );

          return (
            <div class={styles.dashboard}>
              <div class={styles.dashboard_full_width}>
                <Today
                  date={today}
                  currently={data.forecast.currently}
                  forecast={data.forecast.daily.data[0]}
                  events={events.filter(event => isSameDay(today, event.start))}
                  games={games.filter(game => isSameDay(today, game.date))}
                />
              </div>
              <div class={styles.dashboard_column}>
                {range.map(date => (
                  <CalendarDay
                    date={date}
                    events={events.filter(event =>
                      isSameDay(date, event.start)
                    )}
                    forecast={data.forecast.daily.data.find(daily =>
                      isSameDay(date, daily.time * 1000)
                    )}
                    games={games.filter(game => isSameDay(date, game.date))}
                  />
                ))}
                <TwitterList owner_screen_name="acoll1" slug="just-tyler" />
              </div>
              <div class={styles.dashboard_column}>
                {/* <LiveGame /> */}
                <Standings />
              </div>
            </div>
          );
        }}
      </Query>
    </ApolloProvider>
  );
}
