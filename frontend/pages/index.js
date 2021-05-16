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
      url: "http://localhost:5000/getAccessToken", // a changer pour la prod
      data: {
        client_id: 6885,
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
          "def50200fadad672b914f3e0f04d44ffafd3a924df81b34a665736802a26fa46c8bcfec631d24d6134504d6e735cf9416938eca2420fb8073957f0456212a239b56ed21944b96549a8396f32de12b28f2fbff03384b0694825ff0d18350e954c098f4b05e0899fc1ed8eeefcf2b3fec07e4a7655f6ac160a50966fb385b046114f26b88284d79719351f8c3e178a25245197101d7a37c839b8d43aa8f21204e43dbe4ce3c5c022940b2d4ddf4689e648fa33d29b3307504ea6b3601e9ac73eb8f4d4daac09d4be851fc26e039503d005b7c680c8440ea12c8b12a7651a87c8e99b0063ed6c600f41c3be211c3828e6d00ead3fd6d06d5c8c9fd41ded52b82c1f7f3898b491238ae6f21a6728866b7bcded02ff2fee3f1e573de418d58d9ef13a636ed780b60aadf4e38c3b843932545bc349db7200bcad07f9fb3778106c0f6227160071204e685b7faf4042e7675c8e753ca03b429fb0b327bccd9429e5c9678f5be0799c205de9445eb3fc259d7b";
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
