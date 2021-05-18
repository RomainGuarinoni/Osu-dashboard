import cookie from "coookie";

export default function handler(req, res) {
  let cookies = cookie.parse(req.headers.cookie || "");
  let name = cookies.name;
  if (name) {
    console.log(" find");
    res.status(200).json("userID has been find");
  } else {
    console.log("not find");
    res.status(404).json("user ID not find");
  }
}
