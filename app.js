const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const http = require("http").Server(app);
const cors = require("cors");
const axios = require("axios");
const baseUrl = "https://osu.ppy.sh/api/v2/";
//app.use(bodyParser.json())
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.post("/getAccessToken", (req, res, next) => {
  const code = req.body.code;
  const client_id = req.body.client_id;
  const client_secret = req.body.client_secret;
  const redirect_uri = req.body.redirect_uri;

  axios({
    method: "post",
    url: "https://osu.ppy.sh/oauth/token",
    data: {
      code: code,
      client_id: client_id,
      client_secret: client_secret,
      redirect_uri: redirect_uri,
      grant_type: "authorization_code",
    },
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
  })
    .then((response) => res.status(200).json(response.data))
    .catch((err) => {
      console.log("error : " + err);
      res.status(400).json("an error has occured. Check the dev console");
    });
});

app.get("/getUser/:userID/:token", (req, res, next) => {
  const user = req.params.userID;
  const token = req.params.token;

  axios({
    url: `https://osu.ppy.sh/api/v2/users/${user}`,
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => res.status(200).json(response.data))
    .catch((err) => {
      console.log(`error : ${err}`);
      res.status(400).json("an error has occured");
    });
});

app.get("/test/:userID", (req, res, next) => {
  setTimeout(() => {
    res.status(200).json(req.params.userID);
  }, 1000);
});

if (process.env.NODE_ENV === "production") {
  // Static folder
  app.use(express.static(__dirname + "/public/"));

  // Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + "/public/index.html"));
}
http.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
