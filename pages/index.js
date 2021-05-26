import style from "../styles/Home.module.css";
import Head from "next/head";
import HomeProfil from "../components/HomeProfil";
import HomeDashboard from "../components/HomeDashboard";
import Connect from "../components/Connect";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import cookie from "cookie";
import axios from "axios";
import { getCookie } from "../function/getCookie";
import { getUrlParam } from "../function/getUrlParam";
export default function Home({ OSU_API_SECRET, userIDStatus, devStatus }) {
  const router = useRouter();
  //return the dcode in the URL after redirection from osu website

  // return the token or an error
  async function getToken(code) {
    console.log("try get the token");
    console.log(code);
    await axios({
      method: "post",
      url: "/api/getAccessToken", // a changer pour la prod
      data: {
        client_id: 7322,
        client_secret: OSU_API_SECRET,
        code: code,
        redirect_uri: "https://osu-dashboard.vercel.app", // a changer pour la prod
      },
    })
      .then((res) => {
        console.log("we got the token");
        console.log(res.data);
        axios({
          method: "post",
          url: "/api/setCookie",
          data: {
            key: "token",
            value: res.data.access_token,
          },
        })
          .then(() => {
            router.push({
              pathname: "Dashboard",
            });
          })
          .catch(() => setError(true));
      })
      .catch((e) => {
        setError(true);
        console.log("error token");
        console.log(err);
      });
  }

  const [userID, setUserID] = useState(false);
  const [error, setError] = useState(false);
  //vérifier l'état des cookies code lorsque l'appli est monté
  useEffect(() => {
    if (userIDStatus) {
      setUserID(true);
      if (getCookie("code") == "true") {
        document.cookie = "code=false; ";
        const code = getUrlParam("code");
        console.log(code);
        const codeAux =
          "def5020032f2819f7eed644a85205ed2c78257259839a64abdeda73f98f36aace3e6f709c21579e60a209d65ff35adc55e315228a1a3f319680554fb6140ad13a7a9511a76ee1abc6357a620ce1aebef3b1a1f82fc50c66fc37b96ba986810c55ec587061032c1c6efac7303a85c2b0f7b4090a082f732a67bf66d060317e9ea6eeee42fc3278a2f9743fba66d1e3c1e0b35f8041765efecc0a63be08d9ab172ba3972361bdba3dc98fbb9f87deb4ccf662cc18cc70724f9d6403f35ed0cd6faf4d7332b103b64757dd4695db59acdd1abc0ff26c482513940465a53cf8301e668af055f8f25f9a53147463c47d6ad3e491f14ac2b4af640383fe43c58113153d55c2fa68aef586d551cc62512857418a04f2bcdc39b5ec72547a0924e72fb310bab7046a7d6076e2ba387daba3afd3bbae151f5dee2ccad582313e5ec1636a8cab96a18218df4cdbfb111c0e55639fb54927326f29da06db91898582a9e6697951d7f8f7320100e541ef8445bde37a6feff6ab9a4912e4648e223c6";
        if (devStatus) {
          getToken(code);
        } else {
          getToken(codeAux);
        }
      } else {
        //créer le cookie de redirection
        document.cookie = "code=true; ";

        try {
          if (devStatus) {
            window.location.href = `http://localhost:5500`;
          } else {
            window.location.href = `https://osu.ppy.sh/oauth/authorize?client_id=7322&redirect_uri=https://osu-dashboard.vercel.app&response_type=code&scope=public`;
          }
        } catch (err) {
          setError(true);
          document.cookie = "code=false; ";
        }
      }
    } else {
      document.cookie = "code=false; ";
    }
  }, []);
  return (
    <div className={style.container}>
      <div className={style.dashboardContainer}>
        <Head>
          <title>Osu dashboard</title>
        </Head>
        <HomeProfil />
        <HomeDashboard />
      </div>
      <div className={style.connectForm}>
        {userID && !error ? <Loader /> : null}
        {!userID && !error ? (
          <Connect devStatus={devStatus} error={error} setError={setError} />
        ) : null}
        {error ? <Error setError={setError} setUserID={setUserID} /> : null}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  // get the userID cookie
  let userIDStatus = false;
  if (context.req.headers.cookie != undefined) {
    let cookies = cookie.parse(context.req.headers.cookie);
    let userID = cookies.userID;
    if (userID != undefined) {
      userIDStatus = true;
    }
  }
  //get the NODE_ENV status
  let devStatus = true;
  if (process.env.NODE_ENV == "production") {
    devStatus = false;
  }
  return {
    props: {
      OSU_API_SECRET: process.env.OSU_API_SECRET,
      userIDStatus: userIDStatus,
      devStatus: devStatus,
    },
  };
}
