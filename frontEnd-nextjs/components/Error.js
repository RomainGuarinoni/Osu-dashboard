import style from "../styles/Error.module.css";

export default function Error({ error, setError, userID, setUserID }) {
  function handleError() {
    //on suprime le cookie du user
    document.cookie = "userID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    setUserID(false);
    setError(false);
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
        issue on the github of the application
      </p>
      <button className={style.buttonValidate} onClick={handleError}>
        i understand
      </button>
    </div>
  );
}
