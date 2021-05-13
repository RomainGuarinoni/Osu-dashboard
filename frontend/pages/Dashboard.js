import style from "../styles/Dashboard.module.css";
import Head from "next/head";
import Profil from "../components/Profil";
import GraphContainer from "../components/GraphContainer";
import Error from "../components/Error";
import { useState, useEffect } from "react";
export default function Dashboard() {
  const [error, setError] = useState(false);
  useEffect(() => {
    console.log(error);
  }, [error]);
  return (
    <div className={style.container}>
      <Head>
        <title>Osu Dashboard</title>
      </Head>
      <div
        className={style.dashboardContainer}
        style={error ? { filter: "brightness(40%)" } : {}}
      >
        <Profil setErrorSWR={setError} />
        <GraphContainer setErrorSWR={setError} />
      </div>

      {error && (
        <div className={style.error}>
          <Error returnHome={true} />
        </div>
      )}
    </div>
  );
}
