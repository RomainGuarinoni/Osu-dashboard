const axios = require("axios");
exports.getUserInfo = (req, res, next) => {
  const user = req.params.userID;
  const token = req.params.token;
  let responseObject = new Object();
  axios({
    url: `https://osu.ppy.sh/api/v2/users/${user}`,
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      responseObject = response.data;
      return axios({
        url: `https://osu.ppy.sh/api/v2/users/${user}/scores/best`,
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    })
    .catch((err) => {
      console.log(`error 1  : ${err}`);
      res.status(400).json("an error has occured");
    })
    .then((response) => {
      responseObject["bestMapScore"] = response.data[0].pp;
      res.status(200).json(JSON.stringify(responseObject));
    })
    .catch((err) => {
      console.log(`error 2  : ${err}`);
      res.status(400).json("an error has occured");
    });
};
