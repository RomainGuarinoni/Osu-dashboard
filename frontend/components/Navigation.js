import style from "../styles/Navigation.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import {
  faChartLine,
  faAddressBook,
  faDoorOpen,
} from "@fortawesome/free-solid-svg-icons";
export default function Navigation() {
  const router = useRouter();

  function nav(route) {
    if (route == "/") {
      //supprime le cookie
      document.cookie =
        "userID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      router.push({
        pathname: "/",
      });
    } else {
      router.push({
        pathname: route,
      });
    }
  }
  return (
    <div className={style.container}>
      <h1 className={style.title}>OSU DASHBOARD</h1>
      <div className={style.nav} onClick={() => nav("Dashboard")}>
        <p>Dashboard</p>
        <FontAwesomeIcon icon={faChartLine} />
      </div>
      <div className={style.nav} onClick={() => nav("Contact")}>
        <p>Contact us</p>
        <FontAwesomeIcon icon={faAddressBook} />
      </div>
      <div className={style.nav} onClick={() => nav("/")}>
        <p>Disconnect</p>
        <FontAwesomeIcon icon={faDoorOpen} />
      </div>
    </div>
  );
}
