import { h } from "preact";
import { Section } from "./section";
import { Event } from "./event";
import styles from "./calendar.css";

import { asDayOfWeek, temperature, asTimeOfDay } from "../lib/formatters";

export function CalendarDay({ date, forecast, events, games }) {
  return (
    <Section
      title={
        <div class={styles.daySmall}>
          <div>{asDayOfWeek(date)}</div>
          <div class={styles.icon} />
          <div class={styles.temps}>
            <h5>{temperature(forecast.temperatureHigh)}</h5>
            <h5>{temperature(forecast.temperatureLow)}</h5>
          </div>
          <div class={styles.suntimes}>
            <h5>Rise {asTimeOfDay(forecast.sunriseTime * 1000)}</h5>
            <h5>Set {asTimeOfDay(forecast.sunsetTime * 1000)}</h5>
          </div>
        </div>
      }
    >
      {events.map(event => <Event {...event} />)}
      {games.map(game => (
        <Event
          start={game.date}
          summary={`${game.homeTeam.Name} vs ${game.awayTeam.Name}`}
        />
      ))}
    </Section>
  );
}
