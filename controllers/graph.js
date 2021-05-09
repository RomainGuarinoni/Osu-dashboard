const axios = require("axios");
exports.getGraphData = (req, res, next) => {
  const user = req.params.userID;
  const token = req.params.token;
  let objectResponse = new Object();
  axios({
    url: `https://osu.ppy.sh/api/v2/users/${user}`,
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      objectResponse["rankEvolution"] = response.data.rankHistory.data;
      return axios({
        url: `https://osu.ppy.sh/api/v2/users/${user}/scores/recent`,
        method: "get",
        params: {
          limit: 50,
          include_fails: 1,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    })
    .catch((err) => {
      console.log(`error 1 : ${err}`);
      res.status(400).json("there was an error");
    })
    .then((response) => {
      let recentAccuracy = new Array();
      let recentMod = {
        normal: 0,
        EZ: 0,
        NF: 0,
        HT: 0,
        HR: 0,
        SD: 0,
        PF: 0,
        NC: 0,
        FL: 0,
        HD: 0,
        DT: 0,
      };
      let recentDifficulty = new Array();
      let labels = new Array();
      response.data.forEach((element) => {
        recentAccuracy.push(element.accuracy);
        recentDifficulty.push(element.beatmap.difficulty_rating);
        let date = new Date(element.created_at);
        labels.push(`${date.getDay()} / ${date.getMonth()}`);
        labels.push();
        if (element.mods.length == 0) {
          recentMod.normal++;
        } else {
          element.mods.forEach((mod) => {
            recentMod[mod] += 1;
          });
        }
      });
      objectResponse["recentAccuracy"] = recentAccuracy.reverse();
      objectResponse["recentMod"] = recentMod;
      objectResponse["recentDifficulty"] = recentDifficulty.reverse();
      objectResponse["labels"] = labels.reverse();
      return axios({
        url: `https://osu.ppy.sh/api/v2/users/${user}/recent_activity`,
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    })
    .catch((err) => {
      res.status(200).json("there is an error");
      console.log(`error 2 :${err}`);
    })
    .then((response) => {
      let topPlaces = {
        top50: 0,
        top100: 0,
        top250: 0,
        top500: 0,
        top1000: 0,
      };
      response.data.forEach((element) => {
        if (element.rank <= 50) {
          topPlaces["top50"] += 1;
        } else if (element.rank <= 100) {
          topPlaces["top100"] += 1;
        } else if (element.rank <= 250) {
          topPlaces["top250"] += 1;
        } else if (element.rank <= 500) {
          topPlaces["top500"] += 1;
        } else if (element.rank <= 1000) {
          topPlaces["top1000"] += 1;
        }
      });
      objectResponse["topPlaces"] = topPlaces;
      res.status(200).json(objectResponse);
    })
    .catch((err) => {
      console.log(`error 3  : ${err}`);
      res.status(400).json("an error has occured");
    });
};
