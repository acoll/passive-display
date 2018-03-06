const { createAxios } = require("./createAxios");

const darkSkyKey = require("./config").darksky.key;

const api = createAxios({
  baseURL: `https://api.darksky.net/forecast/${darkSkyKey}/`,
  method: "GET"
});

const exclusions = new Set([
  "currently",
  "minutely",
  "hourly",
  "daily",
  "alerts",
  "flags"
]);

async function forecast({ lat = 0, long = 0, fields = [], time = null }) {
  const inclusions = new Set(fields);
  const exclude = [...exclusions].filter(field => !inclusions.has(field));
  const response = await api({
    url: `${lat},${long}${time ? `,${time}` : ""}?exclude=${exclude}`
  });
  return response.data;
}

module.exports = { forecast };
