const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const http = require("http").Server(app);
const cors = require("cors");
const tokenRoutes = require("./routes/tokenRoutes");
const userRoutes = require("./routes/userRoutes");
const graphRoutes = require("./routes/graphRoutes");
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

app.use("/getAccessToken", tokenRoutes);

app.use("/getUser", userRoutes);

app.use("getGraph/", graphRoutes);

if (process.env.NODE_ENV === "production") {
  // Static folder
  app.use(express.static(__dirname + "/public/"));

  // Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + "/public/index.html"));
}
http.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
