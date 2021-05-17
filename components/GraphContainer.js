import style from "../styles/GraphContainer.module.css";
import useSWR from "swr";
import { fetcher } from "../function/fetcher";
import { getCookie } from "../function/getCookie";
import axios from "axios";
import { useEffect } from "react";
import Loader from "./Loader";
import RecentAccuracy from "./RecentAccuracy";
import RecentDifficulty from "./RecentDifficulty";
import RankEvolution from "./RankEvolution";
import RecentMod from "./RecentMod";
import TopPlaces from "./TopPlaces";
import RecentGlobalStats from "./RecentGlobalStats";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faGlobeAmericas } from "@fortawesome/free-solid-svg-icons";
import Radar from "../components/Radar";
export default function GraphContainer({ setErrorDashboard }) {
  const { data, error } = useSWR("/api/getGraph", (url) =>
    axios({
      method: "post",
      url: url,
      data: {
        userID: getCookie("userID"),
        token: getCookie("token"),
      },
    }).then((res) => res.data)
  );

  if (error) {
    console.log(error);
    setErrorDashboard(true);
    return <div className={style.container}></div>;
  }
  if (!data)
    return (
      <div className={style.container}>
        <header className={style.header}>
          <h1 className={style.title}>OSU DASHBOARD</h1>
        </header>
        <div className={style.containerGraph}>
          <div className={style.loader}>
            <Loader />
          </div>
        </div>
        <footer className={style.footer}>
          <a
            href="https://github.com/RomainGuarinoni/Osu-dashboard"
            target="__blank"
          >
            <FontAwesomeIcon className={style.brandIcon} icon={faGithub} />
          </a>
          <a href="https://osu.ppy.sh/home" target="__blank">
            <FontAwesomeIcon
              className={style.brandIcon}
              icon={faGlobeAmericas}
            />
          </a>
        </footer>
      </div>
    );
  setErrorDashboard(false);

  return (
    <div className={style.container}>
      <header className={style.header}>
        <h1 className={style.title}>OSU DASHBOARD</h1>
      </header>
      <div className={style.containerGraph}>
        <div className={style.graphLeft}>
          <RecentAccuracy
            dataValue={data.recentAccuracy}
            labelsValue={data.labels}
          />
          <RankEvolution dataValue={data.rankEvolution} />
          <TopPlaces dataValue={data.topPlaces} />
          <Radar dataValue={data.radar} />
        </div>
        <div className={style.graphRight}>
          <RecentDifficulty
            dataValue={data.recentDifficulty}
            labelsValue={data.labels}
          />

          <RecentMod dataValue={data.recentMod} />
          <RecentGlobalStats
            timePlayed={data.timePlayed}
            averageFault={data.averageFault}
            averageBPM={data.averageBPM}
            failPourcentage={data.failPourcentage}
            averageMaxCombo={data.averageMaxCombo}
            averagePP={data.averagePP}
          />
        </div>
      </div>
      <footer className={style.footer}>
        <a
          href="https://github.com/RomainGuarinoni/Osu-dashboard"
          target="__blank"
        >
          <FontAwesomeIcon className={style.brandIcon} icon={faGithub} />
        </a>
        <a href="https://osu.ppy.sh/home" target="__blank">
          <FontAwesomeIcon className={style.brandIcon} icon={faGlobeAmericas} />
        </a>
      </footer>
    </div>
  );
}
