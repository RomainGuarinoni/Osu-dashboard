import axios from "axios";
export const fetcher = (url, userID,token) => {
  axios({
      url : url,
      data:{
          userID=userID,
          token : token
      }
  }).then((res) => res.data);
};
