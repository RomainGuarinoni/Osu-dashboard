import axios from "axios";
export const fetcher = (url, userID, token) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "post",
      url: url,
      data: {
        userID: userID,
        token: token,
      },
    });
  }).then((res) => {
    res.data;
    resolve();
  });
};
