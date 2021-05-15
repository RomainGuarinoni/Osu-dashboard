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
          "def502008a3a069b5c00a0e7fb4c9656d2ffeae0f866306e0af0a89338771bc59fffaa17cf8086158840f605f81b28019be7c9e321a2fe1c5344f21cf86e43b3ab1a7f432dd3f977c797065386db651f46cad5e1f6119fad95dc3a3c53479f3efcb3cfef5e03cdfc0d15bec0d3f58e71c383f3471aa95fef7a5dd3532354772bad518b0e26b01de9a94be68999a3eba2148979d7663554a52617f884374d9e233bf650c82ec7468ecfde035b0d6d8845de63dadb8704d0f71ea31a55189fd1e641f763852c64905e17894ff5575cfc1e851bc0ab673502f1bbaf1283cc43bcf485d19de0652fda72038561e3495059e9b10ffca44ba60ad16536ed3f00d0a421d180a3dfd1c9334f60bdec74419f6b1be2d0824e9b4c2f3d203e20141508c2b42448f9ac449ed2a8cb5cf00da2f69ee075deaa54151f78c66524fc024744d8615796f9277f513b6dde72bff631801c0f49f5c60597b17d9c9892610442516c3bb86dc21335103d069bbe94fa33bb1d";
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
