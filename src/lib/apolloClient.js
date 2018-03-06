import ApolloClient from "apollo-boost";

let uri = "https://us-central1-passive-display.cloudfunctions.net/api/graph";

if (
  typeof window !== "undefined" &&
  window.location.host !== "passive-display.firebaseapp.com"
) {
  uri = "http://localhost:5000/passive-display/us-central1/api/graph";
}
export function getClient(id) {
  return new ApolloClient({
    uri,
    async request(operation) {
      operation.setContext({
        headers: { auth: id }
      });
    }
  });
}
