const Twit = require("twit");
const config = require("./config").twitter;
const db = require("./db");

const api = new Twit({
  ...config,
  timeout_ms: 60 * 1000 // optional HTTP request timeout to apply to all requests.
});

async function fetchListsForUser(userId) {
  const snap = await db.ref(`/${userId}/twitter-lists`).once("value");

  const data = snap.val() || {};

  const lists = Object.keys(data).map(key => data[key]);

  console.log(lists);

  return Promise.all(
    lists.map(async list => {
      const [owner_screen_name, slug] = list.split("/");
      const listObj = await fetchList(owner_screen_name, slug);
      console.log(listObj);
      return listObj;
    })
  );
}

async function fetchListStatuses(list_id, count = 5) {
  const response = await api.get("lists/statuses", {
    list_id,
    count,
    tweet_mode: "extended"
  });
  return response.data;
}

async function fetchList(owner_screen_name, slug) {
  const response = await api.get("lists/show", { slug, owner_screen_name });

  return response.data;
}

module.exports = { fetchListsForUser, fetchListStatuses };
