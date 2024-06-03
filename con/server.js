const local = {
  url: "http://localhost:3000",
  api: "http://localhost:8000/api/v1",
};
const production = {
  url: "https://dueraso.com",
  api: "https://api.dueraso.com/public/api/v1",

  clientId: "436601941584-ng05st9ub5lijn8lqic6bphgq7mblru6.apps.googleusercontent.com",
  clientSecret: "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",
  redirectUri: "http://localhost:3000/callback",
};

module.exports = process.env.NODE_ENV === "development" ? local : production;
// module.exports = production
