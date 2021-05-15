export function getCookie(value) {
  const cookie = document.cookie;
  let result = cookie.split("; ");
  try {
    // on essaye de trouver le cookie code
    result = result.find((row) => row.startsWith(value)).split("=")[1];
    return result;
  } catch (error) {
    //sinon on retourne null
    return null;
  }
}
