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
          "def502003bdee88ded15c0a32d381f6f0042a21429dd8208b53cc94f550135ccbe8c91be99071b75f6135a1ad794c375c0a4d2bc1855505b0e868eb3b3aad5e9536f762130cc1d04404b17b41db93b4678e29ddaa2f56821ff6e960fbee0313a1ad510003ca7086ccdc6297495f563a54577cdb4611fa56fe0a5159d7e39fb461d937956d5a666e075b5fc78e5856c11ed25fa5eed82892739f9cbcf46534e32c1f2cda0dfbc1772cbf104a3e5e22c505291705d8b6fd7cbf94d1d18036983c5e302d497d2ef50379d746e74fdd8756cf54fd723ae97601cd0ee1f5d2b0230bb4309c28d218a309a7761ab842c97796a12788a9580d925f049ce254772a97755217fe9ade6cf205974284c01d69dd8336e21612fa8adcd03684d4a0527093b7b1d8fc00058ee6a0d85fdd603575575cc60c9230a70fa8a952276f9c8d1f45da03ef9b35ed60a818c278da4c0960f96b29d711cc64d491c487dbfbbe61b6e0cafa8dade8b0b706d62395c4b08cc7d03";
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
