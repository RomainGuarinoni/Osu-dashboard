import style from "../styles/Profil.module.css";
import ProfilPicture from "../components/ProfilPicture";
import { fetcher } from "../function/fetcher";
import Loader from "../components/Loader";
import { getUrlParam } from "../function/getUrlParam";
import useSWR from "swr";
import MapRank from "../components/MapRank";
import GlobalStatistics from "../components/GlobalStatistics";
import { useRouter } from "next/router";
export default function Profil() {
  const router = useRouter();
  const userID = getUrlParam("userID");
  const token = getUrlParam("token");
  console.log(userID);
  console.log(token);
  console.log(`http://localhost:5000/getUser/${userID}/${token}`);
  function sortMapRank(object) {
    let objectAux = {
      ssh: object.ss,
      ss: object.ss,
      sh: object.sh,
      s: object.s,
      a: object.a,
    };
    return objectAux;
  }
  const { data, error } = useSWR(
    `http://localhost:5000/getUser/${userID}/${token}`,
    fetcher
  );
  if (error)
    return (
      <div>
        <p>error</p>
      </div>
    );
  if (!data)
    return (
      <div className={style.container}>
        <Loader />
      </div>
    );
  const finalData = JSON.parse(data);
  return (
    <div className={style.container}>
      <ProfilPicture
        avatar_url={finalData.avatar_url}
        username={finalData.username}
      />
      <div className={style.mapRank}>
        {Object.keys(sortMapRank(finalData.statistics.grade_counts)).map(
          (element, index) => (
            <MapRank
              key={`${element}-${index}`}
              name={element.toUpperCase()}
              color={"white"}
              data={finalData.statistics.grade_counts[element]}
            />
          )
        )}
      </div>
      <GlobalStatistics
        globalRank={finalData.statistics.global_rank}
        countryRank={finalData.statistics.country_rank}
        level={finalData.statistics.level.current}
        accuracy={finalData.statistics.hit_accuracy}
        totalPP={finalData.statistics.PP}
        maxPP={finalData.bestMapScore}
        maxCombo={finalData.statistics.maximum_combo}
      />
    </div>
  );
  /*
  <ProfilPicture avatar_url={data.avatar_url} username={data.username} />
  <div className={style.mapRank}>
        {Object.keys(sortMapRank(data.statistics.grade_counts)).map(
          (element, index) => (
            <MapRank
              key={`${element}-${index}`}
              name={element.toUpperCase()}
              color={"white"}
              data={data.statistics.grade_counts[element]}
            />
          )
        )}
      </div>
      <GlobalStatistics
        globalRank={data.statistics.global_rank}
        countryRank={data.statistics.country_rank}
        level={data.statistics.level.current}
        accuracy={data.statistics.hit_accuracy}
        totalPP={data.statistics.PP}
        maxPP={data.bestMapScore}
        maxCombo={data.statistics.maximum_combo}
      /> */
}
