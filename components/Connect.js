import style from "../styles/Connect.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faGlobeAmericas } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
export default function Connect() {
  const [link, setLink] = useState("");
  const [error, setError] = useState(false);
  function Connect(e) {
    e.preventDefault();
    if (!error) {
      console.log(link);
    }
  }
  function verifyLinkInput(value) {
    setLink(value);
    const regex = /^https:\/\/osu.ppy.sh\/users\/[0-9]+/;
    if (!regex.test(value) && value != "") {
      setError(true);
    } else {
      if (error) {
        setError(false);
      }
    }
  }
  return (
    <div className={style.container}>
      <div className={style.left}>
        <form onSubmit={Connect}>
          <h2>Login</h2>
          <div className={style.inputContainer}>
            <label for="linkInput">Enter your osu! profil link</label>
            <input
              type="txt"
              classe={style.linkInput}
              name="linkInput"
              value={link}
              onChange={(e) => verifyLinkInput(e.target.value)}
              id="linkInput"
            ></input>

            <p className={error ? style.displayError : style.hideError}>
              <span className={style.error}>
                The link you provided is not correct
              </span>
            </p>
          </div>
          <button
            type="submit"
            className={error ? style.buttonInvalidate : style.buttonValidate}
          >
            Log in
          </button>
        </form>
      </div>
      <div className={style.right}>
        <h2>OSU DASHBOARD</h2>
        <p>A Dashboard with much more accurate data than your Osu! account.</p>
        <div className={style.link}>
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
        </div>
      </div>
    </div>
  );
}
