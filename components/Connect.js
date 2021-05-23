import style from "../styles/Connect.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faGlobeAmericas } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from "axios";
export default function Connect({ error, setError }) {
  const [link, setLink] = useState("");
  const [errorInput, setErrorInput] = useState(false);
  async function Connect(e) {
    e.preventDefault();
    if (link.length > 0 && !errorInput) {
      console.log("hello")
        let userID = /^https:\/\/osu.ppy.sh\/users\/(.*)$/g.exec(link);
      // set a cookie for the userID
      await axios({
        method: "post",
        url: "/api/setCookie",
        data: {
          key: "userID",
          value: userID[1],
        },
      })
        .then((res) => {
          console.log(res.data);
        })
        .catch(() => setError(true));
      //créer un cookie session 'code' pour savoir si c'est la première fois qu'on se connecte ou si on attends le code en retour
      document.cookie = "code=true;";

      //envoyer sur la page de sou pour avoir le code
      try {
        window.location.href = "http://localhost:5500"; //https://osu.ppy.sh/oauth/authorize?client_id=6885&redirect_uri=https://example.com&response_type=code&scope=public
      } catch (err) {
        setError(true);
        document.cookie = "code=false;";
      }
    }
  }
  function verifyLinkInput(value) {
    setLink(value);
    const regex = /^https:\/\/osu.ppy.sh\/users\/[0-9]+$/g;
    if (!regex.test(value) && value != "") {
      setErrorInput(true);
    } else {
      setErrorInput(false);
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

            <p className={errorInput ? style.displayError : style.hideError}>
              <span className={style.error}>
                The link you provided is not correct
              </span>
            </p>
          </div>
          <button
            type="submit"
            className={
              errorInput ? style.buttonInvalidate : style.buttonValidate
            }
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
