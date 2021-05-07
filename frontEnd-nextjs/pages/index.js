import style from "../styles/Home.module.css";
import Head from "next/head";
import HomeProfil from "../components/HomeProfil";
import HomeDashboard from "../components/HomeDashboard";
import Connect from "../components/Connect";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { getUrlParam } from "../function/getUrlParam";
export default function Home({ OSU_API_SECRET }) {
  //return cookie value
  const router = useRouter();
  function getCookie(value) {
    const cookie = document.cookie;
    let result = cookie.split("; ");
    try {
      // on essaye de trouver le cookie code
      result = result.find((row) => row.startsWith(value)).split("=")[1];
      return result;
    } catch (error) {
      //sinon on retourne null
      return null;
    }
  }
  //return the dcode in the URL after redirection from osu website

  // return the token or an error
  async function getToken(code) {
    await axios({
      method: "post",
      url: "http://localhost:5000/getAccessToken", // a changer pour la prod
      data: {
        client_id: 6885,
        client_secret: OSU_API_SECRET,
        code: code,
        redirect_uri: "https://example.com", // a changer pour la prod
      },
    })
      .then((res) => {
        router.push({
          pathname: "Dashboard",
          query: { userID: getCookie("userID"), token: res.data.access_token },
        });
      })
      .catch((e) => {
        setError(true);
      });
  }

  const [userID, setUserID] = useState(false);
  const [error, setError] = useState(false);

  //vérifier l'état des cookies code lorsque l'appli est monté
  useEffect(() => {
    // on vérifie si le user s'est déjà connecté auparavant et qu'on a toujours son user id stocké en cookie
    if (getCookie("userID") != null) {
      setUserID(true);
      if (getCookie("code") == "true") {
        document.cookie = "code=false;";
        const code = getUrlParam("code");
        console.log(code);
        const codeAux =
          "def502009abbd291fdf0fa5e33f68ce68bc677712f3aa83a4693101b131f17d3646c4edc29597a4b65da78bf74c07ad6b1c6a7194d9950be8424110e2ba0d9346ddc4c59554852044b13255472fc054f274a970e717ebbe104c47bd65c29e01fb57d75da41636036fbbb206cf57c75ce2d6290e1ba9021af55943032eaeab5957369bde0ebeb9956a77bd0224e34da7f63fc4c57d4820fc738046552ea9d7228ca074c3bee858f1b8f362abf02e061184d342cc167f50183b4ae443eb24fd30f8fd35871cb02bd32aab27e48ff560c94936bf6d52a7f321ddfed2c700ce7e43e2f145493014b9eab9e2bc5481eb985a7b22296ccea0631340bf7267c3bde042f0a2c12fa1169ad27cccc8ec4a523de128ea791b729bc6eb6653ec54e8c30d2eb5f707527522af3723056935eb479c1b187b1bd59a2b5de677c36f504e0d12876a25d6bd63f70d2cb98d9518172446b914f5d733fa31ee58933d78ad05a98d49aedf91cb7d66fa36415134813726b91";
        getToken(codeAux);
      } else {
        //créer le cookie de redirection
        document.cookie = "code=true;";
        try {
          window.location.href = `http://localhost:5500`; //https://osu.ppy.sh/oauth/authorize?client_id=6885&redirect_uri=https://example.com&response_type=code&scope=public
        } catch (err) {
          setError(true);
          document.cookie = "code=false;";
        }
      }
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
          <Connect error={error} setError={setError} />
        ) : null}
        {error ? (
          <Error
            error={error}
            setError={setError}
            userID={userID}
            setUserID={setUserID}
          />
        ) : null}
      </div>
    </div>
  );
}

export async function getStaticProps(context) {
  return {
    props: {
      OSU_API_SECRET: process.env.OSU_API_SECRET,
    },
  };
}
