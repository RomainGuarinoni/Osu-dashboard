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
    if (link.length > 0) {
      let userID = /^https:\/\/osu.ppy.sh\/users\/(.*)$/g.exec(link);

      // set a cookie for the userID
      var expires = new Date(Date.now() + 86400 * 1000).toUTCString();
      document.cookie = `userID=${userID[1]}; expires=${expires}; path=/`;

      //créer un cookie session 'code' pour savoir si c'est la première fois qu'on se connecte ou si on attends le code en retour
      document.cookie = "code=true";

      //envoyer sur la page de sou pour avoir le code
      window.location.href = "http://localhost:5500"; //https://osu.ppy.sh/oauth/authorize?client_id=6885&redirect_uri=https://example.com&response_type=code&scope=public
    }
  }
  function verifyLinkInput(value) {
    setLink(value);
    const regex = /^https:\/\/osu.ppy.sh\/users\/[0-9]+$/g;
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
            <label htmlFor="linkInput">Enter your osu! profil link</label>
            <input
              type="txt"
              className={style.linkInput}
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
            disabled={error}
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
