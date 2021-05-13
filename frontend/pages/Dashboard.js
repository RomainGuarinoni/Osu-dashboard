import style from "../styles/Dashboard.module.css";
import Head from "next/head";
import Profil from "../components/Profil";
import GraphContainer from "../components/GraphContainer";
import { useState } from "react";
import { Provider } from "./HeaderContext";
export default function Dashboard() {
  const [error, setError] = useState(false);
  return (
    <div className={style.container}>
      <Head>
        <title>Osu Dashboard</title>
      </Head>
      <div
        className={style.container}
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
