import axios from "axios";

export default function handler(req, res) {
  const refreshToken = req.body.refreshToken;
  const client_id = req.body.client_id;
  const client_secret = req.body.client_secret;
  const redirect_uri = req.body.redirect_uri;

  axios({
    method: "post",
    url: "https://osu.ppy.sh/oauth/token",
    data: {
      refresh_token: refreshToken,
      client_id: client_id,
      client_secret: client_secret,
      redirect_uri: redirect_uri,
      grant_type: "refresh_token",
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
}
