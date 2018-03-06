import { h } from "preact";
import styles from "./section.css";

export function Section({ title, children }) {
  return (
    <section class={styles.section}>
      <h2>{title}</h2>
      <hr />
      <div>{children}</div>
    </section>
  );
}
