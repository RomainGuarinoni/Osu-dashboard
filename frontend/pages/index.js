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
          "def50200f2c75b83f33b5a89ef010ef0058b20da1ec04b909a37a8c7be812f291736c69ac1ccc665cda5c70a2170e508a67cbfe79fc3dfe1ba2caa61c8736882322d6b3077d8280965202d1d1e37c6a8eebf194b13ca2e44ae85fdc840500a8bdfd819f8e24dc99d2f24a26ce755ec57cf77bb8ae3eba44ece0b1029a1bc9bf9eb1b44676e7c07e24d4263f0c29f86223a9045d9263efa35772b94d770e05e3452942ba478b9791a14fc16aeb7a927372f88fcf8e4e61a4a0000cb0a84da203b21317ce38b7e6ebd0dd8c99cb84b17b576fe6f1d461d2e1fbec85e061cd12fd34628a5c9ac4388272feb5b58879ce938c50633d2c7cb7d309a54f38e5552057a015689bbf7f20c57bd259ef6a67ad54da3910fbae53969d77a0180c2222fc6faa8f46f9314dc4f6c09ae098e83ac15bba0bde76b4f2ae6a2e90df82a53fda58a49629597cb172c808f3b5b5ba6b2c529b497080ea2fd449d91edb6dfcfe198710f77a09ccfa4315a2e5dd7e8355654";
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
