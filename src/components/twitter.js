import { h } from "preact";
import { Section } from "./section";
import styles from "./twitter.css";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";

function renderItem(item) {
  return (
    <div class={styles.news_item}>
      <p>{item.full_text}</p>
      <p>
        <cite>
          {item.user.name} (@{item.user.screen_name})
        </cite>
      </p>
    </div>
  );
}

const twitterQuery = gql`
  {
    twitterLists {
      id
      name
      description
      slug
      full_name
      statuses(count: 3) {
        id
        created_at
        full_text
        user {
          name
          screen_name
        }
      }
    }
  }
`;
export function TwitterList({ owner_screen_name, slug }) {
  return (
    <Query query={twitterQuery}>
      {({ loading, error, data }) => {
        if (loading) {
          return <div>Loading...</div>;
        }

        console.log(data, error);

        return (
          <div>
            {data.twitterLists.map(({ name, statuses }) => (
              <Section title={name}>{statuses.map(renderItem)}</Section>
            ))}
          </div>
        );
      }}
    </Query>
  );
}
