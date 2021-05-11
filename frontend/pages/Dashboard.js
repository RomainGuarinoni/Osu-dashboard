import style from "../styles/Dashboard.module.css";
import Head from "next/head";
import Profil from "../components/Profil";
import GraphContainer from "../components/GraphContainer";
import Error from "../components/Error";
import { useState } from "react";
export default function Dashboard() {
  const [error, setError] = useState(false);

  return (
    <div className={style.container}>
      <Head>
        <title>Osu Dashboard</title>
      </Head>
      <div className={style.dashboardContainer}>
        <Profil setErrorSWR={setError} />
        <GraphContainer setErrorSWR={setError} />
      </div>
      {error && <Error className={style.error} />}
    </div>
  );
}
