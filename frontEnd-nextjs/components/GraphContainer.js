import style from "../styles/GraphContainer.module.css";
import useSWR from "swr";
import { fetcher } from "../function/fetcher";
import { getUrlParam } from "../function/getUrlParam";
import Loader from "../components/Loader";

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
  return (
    <div className={style.container}>
      <h1>coucou</h1>
    </div>
  );
}
