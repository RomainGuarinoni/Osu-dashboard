import style from "../styles/GlobalStatistics.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrophy,
  faChartLine,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import sigma from "../assets/sigma.svg";
import scope from "../assets/scope.svg";
import podium from "../assets/podium.svg";

export default function GlobalStatistics({
  globalRank,
  countryRank,
  level,
  accuracy,
  totalPP,
  maxPP,
  maxCombo,
}) {
  return (
    <div className={style.container}>
      <div className={style.statisticsTitle}>
        <span>
          <FontAwesomeIcon icon={faChartLine} />
        </span>
        <h2>Global statistics</h2>
      </div>
    </div>
  );
}
