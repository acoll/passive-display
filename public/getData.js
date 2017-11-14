var config = {
  apiKey: "AIzaSyCNzQh4bPrOwgFnbClLmCLujnmg6RmxrxE",
  authDomain: "passive-display.firebaseapp.com",
  databaseURL: "https://passive-display.firebaseio.com",
  projectId: "passive-display",
  storageBucket: "passive-display.appspot.com",
  messagingSenderId: "1016056735349"
};
firebase.initializeApp(config);

const db = firebase.firestore();

export async function getData() {
  return db
    .collection("/users/ylYAqJPgfrsYB4Qg9vJR/current_feed_items")
    .get()
    .then(snap => snap.docs.map(doc => doc.data()));
}
