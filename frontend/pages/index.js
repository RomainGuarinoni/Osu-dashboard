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
          "def502000589e86fa849fb6d85e74892458c611273fd6f3e670552dc035f8a937489a1a8f9365a840a68198af5df6d51b6420535377309e203b46fa262c4e0ffed8d7c14b8d63efecc8100d426da6489be153c2f3439e03a866a345d663f85f190a191f0f2bbde561d5fac62c3e4074b79b0f1771be8a2ce7e8fd766e530e5dcac1c5c1e1e2f45d9ca5eb100d2b96e9151296a83f576a1bbae3184a75b2840276080ad825ca4d20892f928a08d154c5de18d389021e40538e3767300e9149e0e417899b033dd50254cb0500324a0c2068fa5f4a2600c560a56cc305595347ffc949602b7730db08816f69f49023d383b26c6bc869f88cee511e76d2965f72c67ca8b975122c327a8705ad3c02144638265fa37152db1c4df1cc5ee64acf264a9382b6c76362e6355615fe289bc0f5c32d2c7cfa2ef363cf59db48d0ec6ab9593d016167a8552fce1da9229d5191726b1260957c87eefcf07c3696ecf1718df28edc82337d5120244161f299387fb3e";
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
