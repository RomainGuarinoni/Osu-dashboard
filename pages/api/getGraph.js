import cookie from "cookie";
import axios from "axios";
export default function handler(req, res) {
  //const user = req.body.userID;
  //const token = req.body.token;
  let cookies = cookie.parse(res.headers.cookie || "");
  let user = cookies.userID;
  let token = cookies.token;
  let recent_include_fails_length = new Number();
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
      recent_include_fails_length = response.data.length;
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
      let totalTimePlayed = new Number();
      let averageFault = new Number();
      let averageMaxCombo = new Number();
      let averageBPM = new Number();
      let averagePP = new Number();
      let averagePPCounter = 0;
      let radar = {
        Difficulty: 0,
        AR: 0,
        CS: 0,
        HP: 0,
        OD: 0,
      };
      response.data.forEach((element) => {
        recentAccuracy.push(element.accuracy);
        recentDifficulty.push(element.beatmap.difficulty_rating);
        totalTimePlayed += element.beatmap.total_length;
        averageFault += element.statistics.count_miss;
        averageMaxCombo += element.max_combo;

        if (element.pp != null) {
          averagePPCounter += 1;
          averagePP += element.pp;
        }

        //set radar data
        radar.Difficulty += element.beatmap.difficulty_rating;
        radar.AR += element.beatmap.ar;
        radar.CS += element.beatmap.cs;
        radar.HP += element.beatmap.drain;
        radar.OD += element.beatmap.accuracy;

        if (element.mods.includes("DT")) {
          averageBPM += element.beatmap.bpm * 1.5;
        } else {
          averageBPM += element.beatmap.bpm;
        }
        let date = new Date(element.created_at);
        labels.push(`${date.getUTCDate()} / ${date.getMonth() + 1}`);
        labels.push();
        if (element.mods.length == 0) {
          recentMod.normal++;
        } else {
          element.mods.forEach((mod) => {
            recentMod[mod] += 1;
          });
        }
      });
      Object.keys(radar).map((key) => (radar[key] /= response.data.length));
      objectResponse["recentAccuracy"] = recentAccuracy.reverse();
      objectResponse["recentMod"] = recentMod;
      objectResponse["recentDifficulty"] = recentDifficulty.reverse();
      objectResponse["labels"] = labels.reverse();
      objectResponse["timePlayed"] = totalTimePlayed;
      objectResponse["averageFault"] = averageFault / response.data.length;
      objectResponse["averageBPM"] = averageBPM / response.data.length;
      objectResponse["averageMaxCombo"] =
        averageMaxCombo / response.data.length;
      objectResponse["radar"] = radar;
      objectResponse["averagePP"] = averagePP / averagePPCounter;
      return axios({
        url: `https://osu.ppy.sh/api/v2/users/${user}/recent_activity`,
        method: "get",
        params: {
          limit: 50,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    })
    .catch((err) => {
      res.status(400).json("there is an error");
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

      return axios({
        url: `https://osu.ppy.sh/api/v2/users/${user}/scores/recent`,
        method: "get",
        params: {
          limit: 50,
          include_fails: 0,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    })
    .catch((err) => {
      console.log(`error 3  : ${err}`);
      res.status(400).json("an error has occured");
    })
    .then((response) => {
      objectResponse["failPourcentage"] =
        (response.data.length / recent_include_fails_length) * 100;
      res.status(200).json(objectResponse);
    })
    .catch((err) => {
      console.log(`last error ${err}`);
      res.status(400).json("an error has occured");
    });
}
