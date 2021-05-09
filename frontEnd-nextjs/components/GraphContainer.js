import style from "../styles/GraphContainer.module.css";
import useSWR from "swr";
import { fetcher } from "../function/fetcher";
import { getUrlParam } from "../function/getUrlParam";
import Loader from "./Loader";
import RecentAccuracy from "./RecentAccuracy";
import RecentDifficulty from "./RecentDifficulty";
import RankEvolution from "./RankEvolution";
import RecentMod from "./RecentMod";
import TopPlaces from "./TopPlaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faGlobeAmericas } from "@fortawesome/free-solid-svg-icons";
export default function GraphContainer() {
  const { data, error } = useSWR(
    `http://localhost:5000/getGraph/${getUrlParam("userID")}/${getUrlParam(
      "token"
    )}`,
    fetcher
  );

  if (error) return <div>Error</div>;
  if (!data)
    return (
      <div className={style.container}>
        <Loader />
      </div>
    );
  console.log(data.recentAccuracy);
  return (
    <div className={style.container}>
      <header className={style.header}>
        <h1 className={style.title}>OSU DASHBOARD</h1>
      </header>
      <div className={style.containerGraph}>
        <RecentAccuracy
          dataValue={data.recentAccuracy}
          labelsValue={data.labels}
        />
        <RecentDifficulty
          dataValue={data.recentDifficulty}
          labelsValue={data.labels}
        />
        <RankEvolution dataValue={data.rankEvolution} />
        <RecentMod dataValue={data.recentMod} />
        <TopPlaces dataValue={data.topPlaces} />
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
