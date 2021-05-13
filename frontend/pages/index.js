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
          "def502005b16d63bbaedb55a38e85e314f136f69830e55f3babb89be8e7bb30466195509bf8f53f78f0d3b13dc785891fcbc9063228940162805a273881b03385fe2f44ddfc4a5f98bcbc7fa677f346dfb6d4f6b8dd2d03a9fc4b69aa9e7ebf1b5795ae2b71d0245aca1d51de5021b4a4fad470a23d665d55498bf90386abe3df0edf137be62caa44e3d62ced5037e0972a1f323caed482ae99ffc6958cc6c7fae2eab24f2c4e6651e6ba80db283a4b5dd22457c259341aac50dab210d2075a4fd4c2fb8af4fb2905101de6743c79d906c1d0b23d317fc0619e17ce4bd6c508eaa65edc4d38fa2e04d1eec16c6f1c6efa538dd2708e30a049b78ba845ab397eb9e6e53c9a44f312b9ec9bc4232d43c38eb45290bc554d7036e753418b53cbbdf40e2c3298ea647635acafe743201719bde76d9c4e5f3f906b718fbb914ab5d894bed17efeb515de609b2bce9470c7b19a0b605fcb5c8bb3ffe2b869767d70e785968352de33e26c30f6f37896a7eb3";
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
        {error ? <Error setError={setError} setUserID={setUserID} /> : null}
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
