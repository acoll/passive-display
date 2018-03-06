import { h } from "preact";
import { Section } from "./section";
import styles from "./today.css";
import { asFullDate, temperature, asTimeOfDay } from "../lib/formatters";
import { LargeEvent } from "./event";

export function Today({ forecast, currently, date, events, games }) {
  const items = [
    ...events.map(({ summary, start }) => ({
      summary,
      start,
      icon: "calendar"
    })),
    ...games.map(({ date, awayTeam, homeTeam }) => ({
      summary: `${awayTeam.Name} at ${homeTeam.Name}`,
      start: date,
      icon: "game"
    }))
  ];

  return (
    <Section title={asFullDate(date)}>
      <div class={styles.today}>
        <div class={styles.events}>
          {items.length === 0 ? (
            <div>Watching the office...</div>
          ) : (
            items.map(event => <LargeEvent {...event} />)
          )}
        </div>
        <div class={styles.weather}>
          <div>weathericon</div>
          <div class={styles.weather_details}>
            <div>
              <h1>{currently.summary}</h1>
            </div>
            <div>
              <h3>High {temperature(forecast.temperatureHigh)}</h3>
              <h3>Low {temperature(forecast.temperatureLow)}</h3>
            </div>
            <div>
              <h4>Sunrise {asTimeOfDay(forecast.sunriseTime * 1000)}</h4>
              <h4>Sunset {asTimeOfDay(forecast.sunsetTime * 1000)}</h4>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
