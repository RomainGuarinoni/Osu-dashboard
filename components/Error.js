import style from "../styles/Error.module.css";
import { useRouter } from "next/router";
import axios from "axios";
export default function Error({ setError, returnHome = false, setUserID }) {
  const router = useRouter();
  async function handleError() {
    //on suprime le cookie du user
    axios({
      method: "post",
      url: "/api/deleteCookie",
      data: {
        key: "userID",
      },
    });
    if (returnHome) {
      router.push({
        pathname: "/",
      });
    } else {
      await axios({
        method: "post",
        url: "/api/deleteCookie",
        data: {
          key: "userID",
        },
      });
      setUserID(false);
      setError(false);
    }
  }

  return (
    <div className={style.container}>
      <h2>Oups...</h2>
      <h3>Something went wrong</h3>
      <p>this is probably due to one of the following reasons : </p>
      <ul>
        <li>Your internet connection has stopped working</li>
        <li>You provided the wrong osu! profil link </li>
        <li>You didn't allow Osu Dashboard to access to your account</li>
      </ul>
      <p>
        If none of the above reasons apply to you, don't hesitate to create an
        issue on the{" "}
        <a
          href="https://github.com/RomainGuarinoni/Osu-dashboard"
          target="__blank"
          className={style.highlight}
        >
          github of the application
        </a>
      </p>
      <button className={style.buttonValidate} onClick={handleError}>
        i understand
      </button>
    </div>
  );
}
