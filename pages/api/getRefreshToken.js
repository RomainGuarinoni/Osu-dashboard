import cookie from "cookie";

export default function handler(req, res) {
  let cookies = cookie.parse(req.headers.cookie || "");
  let refreshToken = cookies.refresh_token;
  if (refreshToken != undefined) {
    res.status(200).json({ refreshToken: refreshToken });
  } else {
    res.status(404).json(" refreshToken not find ");
  }
}
