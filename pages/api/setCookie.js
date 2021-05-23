import cookie from "cookie";

//function that set a HHTP only cookie
/*req => {
    key : String,
    value : String
}*/
export default function handler(req, res) {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize(req.body.key, req.body.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 86400,
      path: "/",
    })
  );
  console.log(req.body.key);
  res.status(200).json({ msg: "cookie has been set : " + req.body.key });
}
