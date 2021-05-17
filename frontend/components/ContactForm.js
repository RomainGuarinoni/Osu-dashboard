import style from "../styles/ContactForm.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faGlobeAmericas } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  function submit(e) {
    e.preventDefault();
    axios({
      method: "post",
      url: "/api/sendMail",
      data: {
        user: name,
        email: email,
        msg: msg,
      },
    })
      .then(() => setSuccess(true))
      .catch((err) => {
        setError(true);
        console.log(err);
      });
  }

  return (
    <div className={style.container}>
      <div className={style.header}>
        <h1>OSU DASHBOARD</h1>
      </div>
      <form className={style.form} onSubmit={(e) => submit(e)}>
        <h2>Contact us !</h2>
        <div className={style.inputBox}>
          <label htmlFor="nameInput"> Name</label>
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={style.inputSmall}
            id="nameInput"
          />
        </div>
        <div className={style.inputBox}>
          <label htmlFor="emailInput"> Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={style.inputSmall}
            id="emailInput"
          />
        </div>
        <div className={style.inputBox}>
          <label htmlFor="msgInput"> Message</label>
          <textarea
            required
            type="text"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className={style.inputLarge}
            id="msgInput"
          />
        </div>
        <button className={style.button} type="submit">
          {" "}
          Submit{" "}
        </button>
        {success && <p className={style.success}>The message has been sent</p>}
        {error && (
          <p className={style.error}>
            An error has occurred, please try again later
          </p>
        )}
      </form>
      <footer className={style.footer}>
        <a
          href="https://github.com/RomainGuarinoni/Osu-dashboard"
          target="__blank"
        >
          <FontAwesomeIcon className={style.brandIcon} icon={faGithub} />
        </a>
        <a href="https://osu.ppy.sh/home" target="__blank">
          <FontAwesomeIcon className={style.brandIcon} icon={faGlobeAmericas} />
        </a>
      </footer>
    </div>
  );
}
