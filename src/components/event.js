import { h } from "preact";
import { asTimeOfDay } from "../lib/formatters";
import styles from "./event.css";

export function LargeEvent({ start, icon, summary }) {
  return (
    <div class={styles.large_event}>
      <span>{icon}</span>
      <span>{asTimeOfDay(start * 1000)}</span>
      <hr />
      <span class={styles.eventSummary}>{summary}</span>
    </div>
  );
}

export function Event({ start, end, summary }) {
  return (
    <div class={styles.event}>
      <span>
        {asTimeOfDay(start)} {end && ` - ${asTimeOfDay(end)}`}
      </span>
      <hr />
      <span class={styles.eventSummary}>{summary}</span>
    </div>
  );
}
