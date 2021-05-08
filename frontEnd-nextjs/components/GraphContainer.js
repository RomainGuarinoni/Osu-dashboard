import style from "../styles/GraphContainer.module.css";
import useSWR from "swr";
import { fetcher } from "../function/fetcher";
import { getUrlParam } from "../function/getUrlParam";
import Loader from "./Loader";
import RecentAccuracy from "./RecentAccuracy";
import RecentDifficulty from "./RecentDifficulty";
import rankEvolution from "./RankEvolution";
import RankEvolution from "./RankEvolution";
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
      <RecentAccuracy
        dataValue={data.recentAccuracy}
        labelsValue={data.labels}
      />
      <RecentDifficulty
        dataValue={data.recentDifficulty}
        labelsValue={data.labels}
      />
      <RankEvolution dataValue={data.rankEvolution} />
    </div>
  );
}
