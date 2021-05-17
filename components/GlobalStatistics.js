import style from "../styles/GlobalStatistics.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import {
  faTrophy,
  faChartLine,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
export default function GlobalStatistics({
  globalRank,
  countryRank,
  level,
  accuracy,
  totalPP,
  maxPP,
  maxCombo,
}) {
  const stat = [
    {
      img: faTrophy,
      name: "Global Rank",
      data: globalRank,
      svg: false,
    },
    {
      img: faTrophy,
      name: "Country Rank",
      data: countryRank,
      svg: false,
    },
    {
      img: faArrowUp,
      name: "Level",
      data: level,
      svg: false,
    },
    {
      img: "scope",
      name: "Accuracy",
      data: `${accuracy.toFixed(2)} %`,
      svg: true,
    },
    {
      img: "sigma",
      name: "Total PP",
      data: totalPP,
      svg: true,
    },
    {
      img: "podium",
      name: "Max PP",
      data: maxPP,
      svg: true,
    },
    {
      img: "podium",
      name: "Max combo",
      data: maxCombo,
      svg: true,
    },
  ];
  return (
    <div className={style.container}>
      <div className={style.statisticsTitle}>
        <span>
          <FontAwesomeIcon icon={faChartLine} />
        </span>
        <h2>Global statistics</h2>
      </div>
      <div className={style.statsBox}>
        {stat.map((item, index) => (
          <div className={style.statItem} key={`${item.name}-${item.index}`}>
            <div className={style.img}>
              {item.svg ? (
                <Image
                  src={`/${item.img}.svg`}
                  alt={item.name}
                  width={25}
                  height={25}
                  className={style.imageNext}
                />
              ) : (
                <FontAwesomeIcon icon={item.img} />
              )}
            </div>
            <p>{item.name} :</p>
            <p>{item.data}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
