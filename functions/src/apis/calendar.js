// @ts-check
const config = require("./config");
const { addDays } = require("date-fns");
const { google } = require("googleapis");
const db = require("./db");

const clientId = config.google.client_id;
const secret = config.google.secret;

async function listCalendarEvents(userId) {
  const credentials = await db
    .ref(`/${userId}/credentials`)
    .once("value")
    .then(snap => snap.val());

  if (!credentials) {
    return [];
  }

  const client = new google.auth.OAuth2(clientId, secret, "http://localhost");
  client.setCredentials({
    access_token: credentials.accessToken,
    id_token: credentials.idToken,
    refresh_token: credentials.refreshToken
  });

  function listCalendars() {
    return new Promise((resolve, reject) => {
      const calendar = google.calendar("v3");
      calendar.calendarList.list(
        { auth: client },
        (err, result) =>
          err ? reject(err) : resolve(result.data && result.data.items)
      );
    });
  }

  function listCalendarEventsForCalendar(id, date = new Date()) {
    return new Promise((resolve, reject) => {
      const calendar = google.calendar("v3");
      calendar.events.list(
        {
          auth: client,
          calendarId: id,
          timeMin: date.toISOString(),
          timeMax: addDays(date, 500).toISOString(),
          maxResults: 50,
          singleEvents: true
        },
        (err, result) => {
          if (err) {
            console.error("Error fetching", id, err.errors);

            resolve([]);
          } else {
            resolve(result.data && result.data.items);
          }
        }
      );
    });
  }
  const calendars = await listCalendars();

  const events = await Promise.all(
    calendars.map(({ id }) => listCalendarEventsForCalendar(id))
  );

  return Array.prototype
    .concat(...events)
    .map(event => {
      return {
        ...event,
        start:
          new Date(event.start.dateTime || event.start.date).getTime() / 1000,
        end: new Date(event.end.dateTime || event.end.date).getTime() / 1000
      };
    })
    .sort((a, b) => a.start - b.start);
}

module.exports = {
  listCalendarEvents
};
