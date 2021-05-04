import style from "../styles/Home.module.css";
import Head from "next/head";
import HomeProfil from "../components/HomeProfil";
import HomeDashboard from "../components/HomeDashboard";
import Connect from "../components/Connect";
import Loader from "../components/Loader";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
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
  function getTheCode() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get("code");

    /*router.push({
      pathname: "Dashboard",
      query: { code: code },
    });*/
    return code;
  }

  // return the token or an error
  async function getToken(code) {
    await axios({
      method: "post",
      url: "https://osu.ppy.sh/oauth/token",
      data: {
        client_id: 6885,
        client_secret: OSU_API_SECRET,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: "https://example.com",
      },
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => {
        console.log(`error in acios : ${e}`);
      });
  }

  const [userID, setUserID] = useState(false);

  //vérifier l'état des cookies code lorsque l'appli est monté
  useEffect(() => {
    // on vérifie si le user s'est déjà connecté auparavant et qu'on a toujours son user id stocké en cookie
    if (getCookie("userID") != null) {
      setUserID(true);
      if (getCookie("code") == "true") {
        document.cookie = "code=false;";
        const code = getTheCode();

        const codeAux =
          "def502002cb0a677c606e8cb4944919a30927da05ec47f3845f566869be8c8b8e4d77a95dca905e3fd452327b07c04ebba47d827f99467613aaf496fdc44443b340d021884eaf46cf6a954f8742c08070c8b24e4a6476caceedb42a562d72e2b004a7b2d141bdc817e754d8c575f94fd29ac4f6efa23ad020ac31dec3bfb9be194ed11adef30439c48494f490dcfc9bd99d89cf59751ac15505eacce870ad3eab72e240c17f5fa054fa868183f79f59a109003595623840a4f4bb3526498e6aafce9eddebc1f5796cb8c71286489da73d62a6981fe694516bf8ceebccf02e39d5acc19ad862fde4229cbe11bb0d9daff96e21cfbf2d33ca8b453d4b0767e4c7b41a6725e37b8c329a578567e48a41c0c3c9f852b8fd3457e391db7172128d5fa15f6aadc7d499ec577353b4a6f9b3ff9c5695f523e374b0a6297fad12a830f754d22355ed94c4187d27eedc40e9f2f7d99a2167766e559a4876ffcc8ef8a2dfdc73ae351282698e36c98113de44e62";
        getToken(codeAux);
      } else {
        //créer le cookie de redirection
        document.cookie = "code=true;";
        window.location.href = `http://localhost:5500`; //https://osu.ppy.sh/oauth/authorize?client_id=6885&redirect_uri=https://example.com&response_type=code&scope=public
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
        {userID ? <Loader /> : <Connect />}
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
