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
import { getCookie } from "../function/getCookie";
import { getUrlParam } from "../function/getUrlParam";
export default function Home({ OSU_API_SECRET }) {
  //return cookie value
  const router = useRouter();
  //return the dcode in the URL after redirection from osu website

  // return the token or an error
  async function getToken(code) {
    await axios({
      method: "post",
      url: "/api/getAccessToken", // a changer pour la prod
      data: {
        client_id: 7322,
        client_secret: OSU_API_SECRET,
        code: code,
        redirect_uri: "https://example.com", // a changer pour la prod
      },
    })
      .then((res) => {
        document.cookie = `token = ${res.data.access_token}`;
        router.push({
          pathname: "Dashboard",
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
          "def502002030d7bcac4c1e3b4e1e6b6dede9dde4cbd14859636697511dcd36b67bb6778bed19939a8d412dcd1ca54999536861936d71c661aa34be764b6ea6d3f8fd7db3bb23f21713aa1c9dc3da565b2e8da8b584b0db723a872669a1c83ee9d059da4aedf59c2b742ce4e2059c4a03fe7b270fd435ad562e91ff20733e4bb08d380f6ad8cfc728b55574406734b39596d109648a74a961d5c7765c5210b83b6715756c5daae970fe3597db94ed4ca0d0d8d6d5b2d518622e9a95dbc67cc46d7149ac2b5236683dcda2c3a3d198462043f03721812e4b69e045f051d40bb4b0cdca78c2bcf9ed9db9fa79a3f282172b148bc48dc695af1e3a10744db3454ec7bc806673d4ccdf08917b2a6109ff97abf2058fdaa437f63c86790f8f1c4dc47561b0b6d3a17a61d8aa50eb3958691b6e4ad473f08e000ecc4bbeacacc246e3bcdab7b920998bafa377d6214a8276f7fa6ccf5ba57f7aa799837f356c7d0a87bb0fd3524d4e68df61b41331c5ca8b0b";
        getToken(codeAux);
      } else {
        //créer le cookie de redirection
        document.cookie = "code=true;";
        try {
          window.location.href = `http://localhost:5500`; //https://osu.ppy.sh/oauth/authorize?client_id=7322&redirect_uri=https://example.com&response_type=code&scope=public
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
